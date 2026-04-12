import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

const AdvancedFilters = ({ filters, onFiltersChange, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync with props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS', 'DNS', 'OTHER'];
  const sizeRanges = [
    { label: 'All', min: 0, max: Infinity },
    { label: 'Small (< 64B)', min: 0, max: 64 },
    { label: 'Medium (64-512B)', min: 64, max: 512 },
    { label: 'Large (512-1500B)', min: 512, max: 1500 },
    { label: 'Jumbo (> 1500B)', min: 1500, max: Infinity }
  ];

  const handleSearchChange = (value) => {
    const newFilters = { ...localFilters, search: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleProtocolToggle = (protocol) => {
    const currentProtocols = localFilters.protocols || [];
    const newProtocols = currentProtocols.includes(protocol)
      ? currentProtocols.filter(p => p !== protocol)
      : [...currentProtocols, protocol];
    
    handleFilterChange('protocols', newProtocols);
  };

  const handleSizeRangeChange = (range) => {
    handleFilterChange('sizeRange', { min: range.min, max: range.max });
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: '',
      protocols: [],
      srcIP: '',
      dstIP: '',
      srcPort: '',
      dstPort: '',
      sizeRange: { min: 0, max: Infinity }
    };
    setLocalFilters(defaultFilters);
    onReset();
  };

  const hasActiveFilters = !!(
    localFilters.search ||
    (localFilters.protocols && localFilters.protocols.length > 0) ||
    localFilters.srcIP ||
    localFilters.dstIP ||
    localFilters.srcPort ||
    localFilters.dstPort ||
    (localFilters.sizeRange && (localFilters.sizeRange.min > 0 || localFilters.sizeRange.max < Infinity))
  );

  return (
    <div className="glass-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Advanced Filters
            </h3>
          </div>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full">
              Active
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Reset</span>
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Search Bar (Always Visible) */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by IP, protocol, or port..."
          value={localFilters.search || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 glass-input"
        />
      </div>

      {/* Advanced Filters (Expandable) */}
      {isExpanded && (
        <div className="space-y-4 animate-fade-in">
          {/* Protocol Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Protocols
            </label>
            <div className="flex flex-wrap gap-2">
              {protocols.map((protocol) => (
                <button
                  key={protocol}
                  onClick={() => handleProtocolToggle(protocol)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    (localFilters.protocols || []).includes(protocol)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {protocol}
                </button>
              ))}
            </div>
          </div>

          {/* IP and Port Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source IP
              </label>
              <input
                type="text"
                placeholder="e.g., 192.168.1.1"
                value={localFilters.srcIP || ''}
                onChange={(e) => handleFilterChange('srcIP', e.target.value)}
                className="w-full px-3 py-2 glass-input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Destination IP
              </label>
              <input
                type="text"
                placeholder="e.g., 192.168.1.1"
                value={localFilters.dstIP || ''}
                onChange={(e) => handleFilterChange('dstIP', e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Source Port
              </label>
              <input
                type="text"
                placeholder="e.g., 80, 443, 8080"
                value={localFilters.srcPort || ''}
                onChange={(e) => handleFilterChange('srcPort', e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Destination Port
              </label>
              <input
                type="text"
                placeholder="e.g., 80, 443, 8080"
                value={localFilters.dstPort || ''}
                onChange={(e) => handleFilterChange('dstPort', e.target.value)}
                className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Packet Size Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Packet Size
            </label>
            <div className="flex flex-wrap gap-2">
              {sizeRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => handleSizeRangeChange(range)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    localFilters.sizeRange?.min === range.min && localFilters.sizeRange?.max === range.max
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
