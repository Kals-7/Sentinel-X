from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import time
from datetime import datetime
import random
from scapy.all import sniff, IP, TCP, UDP, ICMP
from collections import defaultdict, deque
import threading
import queue
import asyncio
from concurrent.futures import ThreadPoolExecutor
import psutil
import gc

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Performance-optimized data structures
packet_queue = queue.Queue(maxsize=5000)  # Thread-safe packet queue
packets_data = deque(maxlen=1000)  # Store last 1000 packets for UI
stats_lock = threading.Lock()  # Thread lock for stats

# Enhanced time-series data for charts
time_series_data = {
    "traffic_over_time": deque(maxlen=200),  # Last 200 time points
    "protocol_timeline": deque(maxlen=200),   # Protocol distribution over time
    "pps_timeline": deque(maxlen=200),        # Packets per second timeline
}

# Optimized stats with lock-free counters where possible
stats = {
    "total_packets": 0,
    "active_connections": 0,
    "data_transferred": 0,
    "packets_per_second": 0,
    "protocol_distribution": defaultdict(int),
    "top_ips": defaultdict(int),
    "traffic_over_time": deque(maxlen=100)
}

# Performance monitoring
performance_stats = {
    "packets_processed": 0,
    "packets_dropped": 0,
    "processing_time_avg": 0.0,
    "memory_usage": 0.0,
    "cpu_usage": 0.0
}

connections = set()
pps_window = deque(maxlen=10)
processing_times = deque(maxlen=100)  # Track processing times

# Thread pool for packet processing
packet_processor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="packet_proc")

# Global flags
capture_active = False
shutdown_event = threading.Event()

def packet_handler(packet):
    """Fast packet handler - just queues packets for processing"""
    global capture_active
    
    if not capture_active:
        return
    
    try:
        # Quick check and queue - minimal processing in capture thread
        if IP in packet:
            # Non-blocking queue put with timeout
            try:
                packet_queue.put(packet, block=False, timeout=0.001)
            except queue.Full:
                with stats_lock:
                    performance_stats["packets_dropped"] += 1
    except Exception as e:
        pass  # Silent fail to avoid slowing capture

def process_packet_batch():
    """Background thread that processes packets from queue"""
    batch_size = 50
    batch = []
    
    while not shutdown_event.is_set():
        try:
            # Collect batch of packets
            try:
                packet = packet_queue.get(timeout=0.1)
                batch.append(packet)
            except queue.Empty:
                # Process any remaining packets in batch
                if batch:
                    process_batch(batch)
                    batch.clear()
                continue
            
            # Process batch when full
            if len(batch) >= batch_size:
                process_batch(batch)
                batch.clear()
                
        except Exception as e:
            print(f"Batch processing error: {e}")
            batch.clear()

def process_batch(batch):
    """Process a batch of packets efficiently"""
    start_time = time.time()
    
    try:
        # Pre-allocate lists for better performance
        packet_infos = []
        current_time = time.time()
        
        for packet in batch:
            if IP in packet:
                packet_info = {
                    "timestamp": datetime.now().isoformat(),
                    "src_ip": packet[IP].src,
                    "dst_ip": packet[IP].dst,
                    "protocol": packet[IP].proto,
                    "size": len(packet),
                    "ttl": packet[IP].ttl
                }
                
                # Fast protocol detection
                if TCP in packet:
                    packet_info["protocol_name"] = "TCP"
                    packet_info["src_port"] = packet[TCP].sport
                    packet_info["dst_port"] = packet[TCP].dport
                elif UDP in packet:
                    packet_info["protocol_name"] = "UDP"
                    packet_info["src_port"] = packet[UDP].sport
                    packet_info["dst_port"] = packet[UDP].dport
                elif ICMP in packet:
                    packet_info["protocol_name"] = "ICMP"
                else:
                    packet_info["protocol_name"] = "OTHER"
                
                packet_infos.append(packet_info)
        
        # Batch update stats with lock
        if packet_infos:
            with stats_lock:
                # Update packet data
                packets_data.extend(packet_infos)
                
                # Batch update counters
                stats["total_packets"] += len(packet_infos)
                total_size = sum(p["size"] for p in packet_infos)
                stats["data_transferred"] += total_size
                
                # Update protocol distribution
                for p in packet_infos:
                    stats["protocol_distribution"][p["protocol_name"]] += 1
                    stats["top_ips"][p["src_ip"]] += 1
                    stats["top_ips"][p["dst_ip"]] += 1
                    
                    # Track connections
                    connection_key = f"{p['src_ip']}:{p.get('src_port', 'N/A')}->{p['dst_ip']}:{p.get('dst_port', 'N/A')}"
                    connections.add(connection_key)
                
                # Update traffic over time
                traffic_point = {
                    "timestamp": current_time,
                    "count": len(packet_infos)
                }
                stats["traffic_over_time"].append(traffic_point)
                time_series_data["traffic_over_time"].append(traffic_point)
                
                # Update protocol timeline
                protocol_snapshot = dict(stats["protocol_distribution"])
                protocol_snapshot["timestamp"] = current_time
                time_series_data["protocol_timeline"].append(protocol_snapshot)
                
                # Update PPS timeline
                pps_window.append(current_time)
                current_pps = len(pps_window)
                stats["packets_per_second"] = current_pps
                time_series_data["pps_timeline"].append({
                    "timestamp": current_time,
                    "pps": current_pps
                })
                
                stats["active_connections"] = len(connections)
                
                # Update performance stats
                performance_stats["packets_processed"] += len(packet_infos)
                
            # Track processing time
            processing_time = time.time() - start_time
            processing_times.append(processing_time)
            
            # Periodic cleanup
            if len(packet_infos) % 1000 == 0:
                gc.collect()  # Force garbage collection
                
    except Exception as e:
        print(f"Batch update error: {e}")

def performance_monitor():
    """Monitor system performance"""
    while not shutdown_event.is_set():
        try:
            with stats_lock:
                # Update performance metrics
                performance_stats["memory_usage"] = psutil.Process().memory_info().rss / 1024 / 1024  # MB
                performance_stats["cpu_usage"] = psutil.Process().cpu_percent()
                
                # Calculate average processing time
                if processing_times:
                    performance_stats["processing_time_avg"] = sum(processing_times) / len(processing_times)
            
            time.sleep(5)  # Update every 5 seconds
        except Exception as e:
            print(f"Performance monitor error: {e}")
            time.sleep(5)

def start_capture(interface=None):
    global capture_active
    
    if capture_active:
        return
    
    capture_active = True
    shutdown_event.clear()
    
    # Start background processing threads
    batch_thread = threading.Thread(target=process_packet_batch, daemon=True)
    batch_thread.start()
    
    monitor_thread = threading.Thread(target=performance_monitor, daemon=True)
    monitor_thread.start()
    
    try:
        # Start packet capture in main thread
        sniff(prn=packet_handler, store=0, stop_filter=lambda x: not capture_active)
    except Exception as e:
        print(f"Capture error: {e}")
        capture_active = False

def stop_capture():
    global capture_active
    capture_active = False
    shutdown_event.set()
    
    # Clear remaining packets
    while not packet_queue.empty():
        try:
            packet_queue.get_nowait()
        except queue.Empty:
            break

@app.route("/")
def root():
    return jsonify({"message": "Sentinel-X API is running"})

@app.route("/api/stats")
def get_stats():
    with stats_lock:
        # Thread-safe stats access
        protocol_dist = dict(stats["protocol_distribution"])
        top_ips = sorted(stats["top_ips"].items(), key=lambda x: x[1], reverse=True)[:10]
        
        # Enhanced time-series data for smooth chart updates
        traffic_data = list(time_series_data["traffic_over_time"])
        protocol_timeline = list(time_series_data["protocol_timeline"])
        pps_timeline = list(time_series_data["pps_timeline"])
        
        # Aggregate protocol data for pie chart
        protocol_chart_data = []
        for protocol, count in protocol_dist.items():
            protocol_chart_data.append({
                "name": protocol,
                "value": count,
                "percentage": round((count / max(stats["total_packets"], 1)) * 100, 1)
            })
        
        # Prepare top IPs for bar chart
        top_ips_chart = []
        for ip, count in top_ips:
            top_ips_chart.append({
                "ip": ip[:15] + "..." if len(ip) > 15 else ip,
                "packets": count
            })
        
        response_data = {
            "total_packets": stats["total_packets"],
            "active_connections": stats["active_connections"],
            "data_transferred": stats["data_transferred"],
            "packets_per_second": stats["packets_per_second"],
            "protocol_distribution": protocol_dist,
            "top_ips": top_ips,
            "traffic_over_time": traffic_data,
            "protocol_timeline": protocol_timeline,
            "pps_timeline": pps_timeline,
            "protocol_chart_data": protocol_chart_data,
            "top_ips_chart": top_ips_chart,
            "performance": {
                "packets_processed": performance_stats["packets_processed"],
                "packets_dropped": performance_stats["packets_dropped"],
                "processing_time_avg": round(performance_stats["processing_time_avg"] * 1000, 2),  # ms
                "memory_usage": round(performance_stats["memory_usage"], 2),  # MB
                "cpu_usage": round(performance_stats["cpu_usage"], 2),  # %
                "queue_size": packet_queue.qsize()
            }
        }
    
    return jsonify(response_data)

@app.route("/api/packets")
def get_packets():
    limit = int(request.args.get('limit', 50))
    offset = int(request.args.get('offset', 0))
    
    # Get filter parameters
    search = request.args.get('search', '')
    protocols = request.args.getlist('protocols')
    src_ip = request.args.get('srcIP', '')
    dst_ip = request.args.get('dstIP', '')
    src_port = request.args.get('srcPort', '')
    dst_port = request.args.get('dstPort', '')
    size_min = int(request.args.get('sizeMin', 0))
    size_max_str = request.args.get('sizeMax', 'inf')
    size_max = float('inf') if size_max_str == 'inf' else int(size_max_str)
    
    with stats_lock:
        packets = list(packets_data)
    
    # Apply filters
    filtered_packets = []
    for packet in packets:
        # Search filter
        if search:
            search_lower = search.lower()
            if not (search_lower in packet.get('src_ip', '').lower() or
                   search_lower in packet.get('dst_ip', '').lower() or
                   search_lower in packet.get('protocol_name', '').lower() or
                   search_lower in str(packet.get('src_port', '')) or
                   search_lower in str(packet.get('dst_port', ''))):
                continue
        
        # Protocol filter
        if protocols and packet.get('protocol_name') not in protocols:
            continue
        
        # Source IP filter
        if src_ip and src_ip not in packet.get('src_ip', ''):
            continue
        
        # Destination IP filter
        if dst_ip and dst_ip not in packet.get('dst_ip', ''):
            continue
        
        # Source port filter
        if src_port:
            src_port_num = str(packet.get('src_port', ''))
            if src_port not in src_port_num:
                continue
        
        # Destination port filter
        if dst_port:
            dst_port_num = str(packet.get('dst_port', ''))
            if dst_port not in dst_port_num:
                continue
        
        # Size filter (skip if "All" is selected)
        packet_size = packet.get('size', 0)
        if size_min > 0 or size_max < float('inf'):  # Only apply if not "All"
            if packet_size < size_min or packet_size > size_max:
                continue
        
        filtered_packets.append(packet)
    
    # Sort by timestamp (newest first) and paginate
    filtered_packets.reverse()
    paginated_packets = filtered_packets[offset:offset + limit]
    
    return jsonify({
        "packets": paginated_packets,
        "total": len(filtered_packets),
        "filtered": len(filtered_packets) != len(packets)
    })

@app.route("/api/capture/start", methods=['POST'])
def start_capture_endpoint():
    if not capture_active:
        # Start capture in background thread
        capture_thread = threading.Thread(target=start_capture, daemon=True)
        capture_thread.start()
        return jsonify({"status": "started"})
    else:
        return jsonify({"status": "already_running"})

@app.route("/api/capture/stop", methods=['POST'])
def stop_capture_endpoint():
    stop_capture()
    return jsonify({"status": "stopped"})

@app.route("/api/capture/status")
def capture_status():
    return jsonify({"active": capture_active})

@app.route("/api/interfaces")
def get_interfaces():
    try:
        from scapy.all import get_if_list
        interfaces = get_if_list()
        return jsonify({"interfaces": interfaces})
    except Exception as e:
        return jsonify({"interfaces": ["eth0", "lo", "wlan0"]})  # Fallback

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
