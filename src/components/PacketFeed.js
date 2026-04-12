import React, { useState, useEffect, useCallback } from 'react';
import { Download, X, Clock, Globe, Shield, Database } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

const PacketFeed = ({ filters }) => {
  const [packets, setPackets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPackets, setTotalPackets] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState(null);
  const [showPacketDetails, setShowPacketDetails] = useState(false);
  const packetsPerPage = 10;

  // Debounce search term for better performance
  const debouncedSearch = useDebounce(filters.search || '', 300);

  // Build query parameters for API call
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();
    params.append('limit', packetsPerPage);
    params.append('offset', (currentPage - 1) * packetsPerPage);
    
    if (debouncedSearch) {
      params.append('search', debouncedSearch);
    }
    
    if (filters.protocols && filters.protocols.length > 0) {
      params.append('protocols', filters.protocols.join(','));
    }
    
    if (filters.srcIP) {
      params.append('srcIP', filters.srcIP);
    }
    
    if (filters.dstIP) {
      params.append('dstIP', filters.dstIP);
    }
    
    if (filters.srcPort) {
      params.append('srcPort', filters.srcPort);
    }
    
    if (filters.dstPort) {
      params.append('dstPort', filters.dstPort);
    }
    
    if (filters.sizeRange) {
      params.append('sizeMin', filters.sizeRange.min);
      params.append('sizeMax', filters.sizeRange.max === Infinity ? 'inf' : filters.sizeRange.max);
    }
    
    return params.toString();
  }, [currentPage, debouncedSearch, filters]);

  // Fetch packets from backend
  const fetchPackets = useCallback(async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || '/api';
      const response = await fetch(`${apiUrl}/packets?${buildQueryParams()}`);
      const data = await response.json();
      setPackets(data.packets || []);
      setTotalPackets(data.total || 0);
      setIsFiltered(data.filtered || false);
    } catch (error) {
      console.error('Failed to fetch packets:', error);
      setPackets([]);
      setTotalPackets(0);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, debouncedSearch]);

  // Fetch packets when page or filters change
  useEffect(() => {
    fetchPackets();
  }, [currentPage, debouncedSearch, filters, fetchPackets]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getProtocolColor = (protocol) => {
    const colors = {
      'TCP': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'UDP': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'ICMP': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'OTHER': 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };
    return colors[protocol] || colors['OTHER'];
  };

  const exportData = async (format) => {
    try {
      // Get all filtered packets for export
      const queryParams = buildQueryParams().replace(/limit=\d+&offset=\d+/, 'limit=10000&offset=0');
      const response = await fetch(`/api/packets?${queryParams}`);
      const data = await response.json();
      
      const exportData = data.packets.map(packet => ({
        timestamp: packet.timestamp,
        src_ip: packet.src_ip,
        dst_ip: packet.dst_ip,
        protocol: packet.protocol_name,
        size: packet.size,
        src_port: packet.src_port || 'N/A',
        dst_port: packet.dst_port || 'N/A'
      }));

      if (format === 'csv') {
        const csv = [
          Object.keys(exportData[0] || {}).join(','),
          ...exportData.map(row => Object.values(row).join(','))
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `packets_${new Date().toISOString()}.csv`;
        a.click();
      } else if (format === 'json') {
        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `packets_${new Date().toISOString()}.json`;
        a.click();
      }
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  const totalPages = Math.ceil(totalPackets / packetsPerPage);

  // Handle packet click to show details
  const handlePacketClick = (packet) => {
    setSelectedPacket(packet);
    setShowPacketDetails(true);
  };

  // Close packet details modal
  const closePacketDetails = () => {
    setShowPacketDetails(false);
    setSelectedPacket(null);
  };

  // Format packet details for display
  const formatPacketDetails = (packet) => {
    return {
      timestamp: packet.timestamp || 'N/A',
      sourceIP: packet.src_ip || 'N/A',
      sourcePort: packet.src_port || 'N/A',
      destIP: packet.dst_ip || 'N/A',
      destPort: packet.dst_port || 'N/A',
      protocol: packet.protocol_name || 'N/A',
      size: packet.size || 0,
      ttl: packet.ttl || 'N/A',
      protocolNumber: packet.protocol || 'N/A'
    };
  };

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Packet Activity Feed
          </h3>
          {isFiltered && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
              Filtered
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Export Buttons */}
          <button
            onClick={() => exportData('csv')}
            disabled={loading}
            className="glass-button flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">CSV</span>
          </button>
          
          <button
            onClick={() => exportData('json')}
            disabled={loading}
            className="glass-button flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">JSON</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Source</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Destination</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Protocol</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Size</th>
              </tr>
            </thead>
            <tbody>
              {packets.map((packet, index) => (
                <tr 
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                  onClick={() => handlePacketClick(packet)}
                >
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                    {formatTime(packet.timestamp)}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {packet.src_ip}
                      </div>
                      {packet.src_port && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          :{packet.src_port}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {packet.dst_ip}
                      </div>
                      {packet.dst_port && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          :{packet.dst_port}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getProtocolColor(packet.protocol_name)}`}>
                      {packet.protocol_name}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100">
                    {formatBytes(packet.size)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * packetsPerPage + 1} to {Math.min(currentPage * packetsPerPage, totalPackets)} of {totalPackets} packets
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && packets.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            {totalPackets === 0 ? 'No packets captured yet. Start capturing to see data.' : 'No packets match your filters.'}
          </div>
        </div>
      )}

      {/* Packet Details Modal */}
      {showPacketDetails && selectedPacket && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Database className="w-6 h-6 text-primary-600" />
                <span>Packet Details</span>
              </h3>
              <button
                onClick={closePacketDetails}
                className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Packet Information */}
            <div className="space-y-6">
              {(() => {
                const details = formatPacketDetails(selectedPacket);
                return (
                  <>
                    {/* Timestamp */}
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Timestamp</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {new Date(details.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Source Information */}
                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-blue-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Source</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {details.sourceIP}:{details.sourcePort}
                        </p>
                      </div>
                    </div>

                    {/* Destination Information */}
                    <div className="flex items-start space-x-3">
                      <Globe className="w-5 h-5 text-green-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Destination</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {details.destIP}:{details.destPort}
                        </p>
                      </div>
                    </div>

                    {/* Protocol Information */}
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-purple-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Protocol</p>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getProtocolColor(details.protocol)}`}>
                            {details.protocol}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            (Protocol #{details.protocolNumber})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Packet Size */}
                    <div className="flex items-start space-x-3">
                      <Database className="w-5 h-5 text-orange-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Packet Size</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {formatBytes(details.size)}
                        </p>
                      </div>
                    </div>

                    {/* TTL (Time to Live) */}
                    {details.ttl !== 'N/A' && (
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-red-400 mt-1" />
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time to Live (TTL)</p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {details.ttl}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Raw Data Preview */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Raw Packet Data</p>
                      <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 font-mono text-xs text-gray-700 dark:text-gray-300 max-h-40 overflow-y-auto border border-gray-200 dark:border-gray-600">
                        {JSON.stringify(selectedPacket, null, 2)}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closePacketDetails}
                className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-lg px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-200 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacketFeed;
