import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Download, Eye, AlertTriangle, CheckCircle, XCircle, Clock, User, Shield, Activity } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: new Date(),
      level: 'info',
      category: 'authentication',
      user: 'admin',
      action: 'Login successful',
      details: 'User admin logged in from 192.168.1.100',
      ip: '192.168.1.100',
      sessionId: 'sess_abc123',
      severity: 'low'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 300000),
      level: 'warning',
      category: 'security',
      user: 'system',
      action: 'Failed login attempt',
      details: 'Multiple failed login attempts for user admin',
      ip: '192.168.1.105',
      sessionId: null,
      severity: 'medium'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 600000),
      level: 'error',
      category: 'system',
      user: 'system',
      action: 'Packet capture error',
      details: 'Failed to start packet capture on interface eth0',
      ip: 'localhost',
      sessionId: null,
      severity: 'high'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 900000),
      level: 'info',
      category: 'configuration',
      user: 'admin',
      action: 'Configuration updated',
      details: 'Updated CORS settings and debug mode',
      ip: '192.168.1.100',
      sessionId: 'sess_abc123',
      severity: 'low'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 1200000),
      level: 'critical',
      category: 'security',
      user: 'system',
      action: 'Suspicious activity detected',
      details: 'Unusual packet capture patterns detected',
      ip: '192.168.1.150',
      sessionId: 'sess_xyz789',
      severity: 'critical'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [showDetails, setShowDetails] = useState(null);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || log.severity === selectedSeverity;
    return matchesSearch && matchesLevel && matchesCategory && matchesSeverity;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 'info': return 'text-blue-600 bg-blue-50';
      case 'warning': return 'text-yellow-600 bg-yellow-50';
      case 'error': return 'text-red-600 bg-red-50';
      case 'critical': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'authentication': return <User className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'system': return <Activity className="w-4 h-4" />;
      case 'configuration': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Category', 'User', 'Action', 'Details', 'IP', 'Severity'],
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.level,
        log.category,
        log.user,
        log.action,
        log.details,
        log.ip,
        log.severity
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Audit Logs</h2>
          </div>
          <button
            onClick={exportLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold">{logs.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Events</p>
              <p className="text-2xl font-bold text-red-600">{logs.filter(l => l.severity === 'critical').length}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Security Events</p>
              <p className="text-2xl font-bold text-orange-600">{logs.filter(l => l.category === 'security').length}</p>
            </div>
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-green-600">{new Set(logs.filter(l => l.sessionId).map(l => l.sessionId)).size}</p>
            </div>
            <User className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
            <option value="critical">Critical</option>
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="authentication">Authentication</option>
            <option value="security">Security</option>
            <option value="system">System</option>
            <option value="configuration">Configuration</option>
          </select>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {log.timestamp.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(log.category)}
                      <span className="text-sm text-gray-900">{log.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.user}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{log.action}</div>
                      <div className="text-gray-500 text-xs">{log.details.substring(0, 50)}...</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setShowDetails(log)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Log Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Timestamp</label>
                  <p className="text-gray-900">{showDetails.timestamp.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Level</label>
                  <p className="text-gray-900">{showDetails.level}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <p className="text-gray-900">{showDetails.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">User</label>
                  <p className="text-gray-900">{showDetails.user}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">IP Address</label>
                  <p className="text-gray-900">{showDetails.ip}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Session ID</label>
                  <p className="text-gray-900">{showDetails.sessionId || 'N/A'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Action</label>
                <p className="text-gray-900 font-medium">{showDetails.action}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Details</label>
                <p className="text-gray-900">{showDetails.details}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Severity</label>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(showDetails.severity)}`}>
                  {showDetails.severity}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetails(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
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

export default AuditLogs;
