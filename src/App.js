import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import MetricCards from './components/MetricCards';
import ChartsSection from './components/ChartsSection';
import PacketFeed from './components/PacketFeed';
import PerformanceMetrics from './components/PerformanceMetrics';
import AdvancedFilters from './components/AdvancedFilters';
import SecurityAssistant from './components/SecurityAssistant';
import UserManagement from './components/UserManagement';
import SystemHealth from './components/SystemHealth';
import AuditLogs from './components/AuditLogs';
import SettingsPanel from './components/Settings';
import QRCodeDisplay from './components/QRCodeDisplay';
import { useTheme } from './hooks/useTheme';

function App() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stats, setStats] = useState({
    total_packets: 0,
    active_connections: 0,
    data_transferred: 0,
    packets_per_second: 0,
    protocol_distribution: {},
    top_ips: [],
    traffic_over_time: []
  });
    const [selectedInterface, setSelectedInterface] = useState('eth0');
  const [interfaces, setInterfaces] = useState([
    {id: 'eth0', name: 'Ethernet', description: 'Wired network connection'},
    {id: 'lo', name: 'Localhost', description: 'Local loopback interface'},
    {id: 'wlan0', name: 'WiFi', description: 'Wireless network connection'}
  ]);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Filter state with URL persistence
  const [filters, setFilters] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      search: urlParams.get('search') || '',
      protocols: urlParams.get('protocols') ? urlParams.get('protocols').split(',') : [],
      srcIP: urlParams.get('srcIP') || '',
      dstIP: urlParams.get('dstIP') || '',
      srcPort: urlParams.get('srcPort') || '',
      dstPort: urlParams.get('dstPort') || '',
      sizeRange: {
        min: parseInt(urlParams.get('sizeMin')) || 0,
        max: parseInt(urlParams.get('sizeMax')) || Infinity
      }
    };
  });

  // Update URL when filters change
  useEffect(() => {
    const urlParams = new URLSearchParams();
    
    if (filters.search) urlParams.set('search', filters.search);
    if (filters.protocols.length > 0) urlParams.set('protocols', filters.protocols.join(','));
    if (filters.srcIP) urlParams.set('srcIP', filters.srcIP);
    if (filters.dstIP) urlParams.set('dstIP', filters.dstIP);
    if (filters.srcPort) urlParams.set('srcPort', filters.srcPort);
    if (filters.dstPort) urlParams.set('dstPort', filters.dstPort);
    if (filters.sizeRange.min > 0) urlParams.set('sizeMin', filters.sizeRange.min);
    if (filters.sizeRange.max < Infinity) urlParams.set('sizeMax', filters.sizeRange.max);
    
    const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Reset filters
  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      protocols: [],
      srcIP: '',
      dstIP: '',
      srcPort: '',
      dstPort: '',
      sizeRange: { min: 0, max: Infinity }
    };
    setFilters(defaultFilters);
  };

  // Reset entire application
  const handleReset = async () => {
    try {
      // Stop capture if running
      if (isCapturing) {
        const apiUrl = process.env.REACT_APP_API_URL || '/api';
        await fetch(`${apiUrl}/capture/stop`, { method: 'POST' });
        setIsCapturing(false);
      }

      // Reset all state
      setStats({
        total_packets: 0,
        active_connections: 0,
        data_transferred: 0,
        packets_per_second: 0,
        protocol_distribution: {},
        top_ips: [],
        traffic_over_time: []
      });

                  setPerformance({
        packets_processed: 0,
        packets_dropped: 0,
        processing_time_avg: 0,
        memory_usage: 0,
        cpu_usage: 0,
        queue_size: 0
      });

      // Reset filters
      handleResetFilters();

      // Clear any cached data
      lastStatsRef.current = {};
      consecutiveErrorsRef.current = 0;
      setPollInterval(2000);

      console.log('Application reset successfully');
    } catch (error) {
      console.error('Failed to reset application:', error);
    }
  };
  
  const { theme, toggleTheme } = useTheme();
  const [isConnected, setIsConnected] = useState(true);
  const [performance, setPerformance] = useState({
    packets_processed: 0,
    packets_dropped: 0,
    processing_time_avg: 0,
    memory_usage: 0,
    cpu_usage: 0,
    queue_size: 0
  });
    
  // Adaptive polling - faster when capturing, slower when idle
  const [pollInterval, setPollInterval] = useState(2000);
  const lastStatsRef = useRef({});
  const consecutiveErrorsRef = useRef(0);

  // Optimized stats fetching with adaptive polling// Fetch stats from backend
  const fetchStats = useCallback(async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/stats`);
      const data = await response.json();
      
      // Enhanced data buffering for smooth chart updates
      const bufferedData = {
        ...data,
        // Ensure minimum data points for smooth animations
        traffic_over_time: data.traffic_over_time || [],
        protocol_timeline: data.protocol_timeline || [],
        pps_timeline: data.pps_timeline || [],
        // Buffer chart data to prevent flickering
        protocol_chart_data: data.protocol_chart_data || [],
        top_ips_chart: data.top_ips_chart || []
      };
      
      // Only update state if data actually changed (prevents unnecessary re-renders)
      const hasChanges = JSON.stringify(bufferedData) !== JSON.stringify(lastStatsRef.current);
      
      if (hasChanges) {
        setStats(bufferedData);
        setPerformance(data.performance || performance);
        lastStatsRef.current = bufferedData;
        setIsConnected(true);
        consecutiveErrorsRef.current = 0;
        
        // Enhanced adaptive polling based on activity and data complexity
        const dataComplexity = (bufferedData.traffic_over_time?.length || 0) + 
                             (bufferedData.protocol_timeline?.length || 0) +
                             (bufferedData.pps_timeline?.length || 0);
        
        if (data.packets_per_second > 100 || dataComplexity > 100) {
          setPollInterval(800); // Fast polling for high traffic/complex data
        } else if (data.packets_per_second > 10) {
          setPollInterval(1200); // Medium polling
        } else {
          setPollInterval(2000); // Normal polling
        }
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setIsConnected(false);
      consecutiveErrorsRef.current++;
      
      // Slow down polling on consecutive errors
      if (consecutiveErrorsRef.current > 3) {
        setPollInterval(5000);
      }
    }
  }, [performance]);

  // Adaptive polling effect
  useEffect(() => {
    fetchStats(); // Initial fetch
    const interval = setInterval(fetchStats, pollInterval);
    return () => clearInterval(interval);
  }, [fetchStats, pollInterval]);

  // Fetch available network interfaces
  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || '/api';
    fetch(`${apiUrl}/interfaces`)
      .then(response => response.json())
      .then(data => {
        if (data.interfaces && data.interfaces.length > 0) {
          setInterfaces(data.interfaces);
          // Set the first interface ID as selected, not the whole object
          setSelectedInterface(data.interfaces[0].id);
        }
      })
      .catch(err => console.error('Failed to fetch interfaces:', err));
  }, []);

  const startCapture = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/capture/start`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' } 
      });
      const data = await response.json();
      if (data.status === 'started' || data.status === 'already_running') {
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Failed to start capture:', error);
    }
  };

  const stopCapture = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/capture/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.status === 'stopped') {
        setIsCapturing(false);
      }
    } catch (error) {
      console.error('Failed to stop capture:', error);
    }
  };

  const fetchPackets = useCallback(async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/packets?limit=50`);
      await response.json();
      // Packets state was removed, keeping for potential future use
    } catch (error) {
      console.error('Failed to fetch packets:', error);
    }
  }, []);

  // Fetch packets periodically when capturing
  useEffect(() => {
    if (isCapturing) {
      fetchPackets();
      const interval = setInterval(fetchPackets, 2000);
      return () => clearInterval(interval);
    }
  }, [isCapturing, fetchPackets]);

  return (
    <div className={`min-h-screen ${theme}`}>
      <Navbar
        appName="Sentinel-X"
        isCapturing={isCapturing}
        selectedInterface={selectedInterface}
        interfaces={interfaces}
        onInterfaceChange={setSelectedInterface}
        onStartCapture={startCapture}
        onStopCapture={stopCapture}
        onThemeToggle={toggleTheme}
        theme={theme}
        isConnected={isConnected}
        onReset={handleReset}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            <MetricCards stats={stats} />
            
            <PerformanceMetrics performance={performance} />
            
            <ChartsSection stats={stats} />
            
            <AdvancedFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
            
            <PacketFeed filters={filters} />
          </div>
        )}
        
        {currentView === 'security' && <SecurityAssistant />}
        {currentView === 'users' && <UserManagement />}
        {currentView === 'health' && <SystemHealth />}
        {currentView === 'audit' && <AuditLogs />}
        {currentView === 'settings' && <SettingsPanel />}
        {currentView === 'qrcode' && <QRCodeDisplay />}
      </main>
    </div>
  );
}

export default App;
