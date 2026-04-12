import React, { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, MemoryStick, Wifi, AlertTriangle, CheckCircle, Activity, Zap, Database, Shield, XCircle } from 'lucide-react';

const SystemHealth = () => {
  const [systemStats, setSystemStats] = useState({
    cpu: { usage: 45, temperature: 42, cores: 8 },
    memory: { used: 8.2, total: 16, percentage: 51 },
    disk: { used: 256, total: 512, percentage: 50 },
    network: { upload: 1.2, download: 3.4, latency: 12 },
    database: { connections: 15, queries: 1250, uptime: '15 days' },
    services: [
      { name: 'Packet Capture', status: 'running', uptime: '2h 15m' },
      { name: 'API Server', status: 'running', uptime: '15 days' },
      { name: 'Database', status: 'running', uptime: '15 days' },
      { name: 'WebSocket Server', status: 'running', uptime: '2h 15m' }
    ]
  });

  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'CPU usage above 40% for 5 minutes', timestamp: new Date() },
    { id: 2, type: 'info', message: 'Database backup completed successfully', timestamp: new Date(Date.now() - 3600000) },
    { id: 3, type: 'error', message: 'Failed to connect to external API', timestamp: new Date(Date.now() - 7200000) }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        cpu: { 
          ...prev.cpu, 
          usage: Math.max(20, Math.min(80, prev.cpu.usage + (Math.random() - 0.5) * 10))
        },
        memory: { 
          ...prev.memory, 
          used: Math.max(6, Math.min(14, prev.memory.used + (Math.random() - 0.5) * 2))
        },
        network: { 
          ...prev.network, 
          upload: Math.max(0.5, Math.min(10, prev.network.upload + (Math.random() - 0.5) * 2)),
          download: Math.max(0.5, Math.min(10, prev.network.download + (Math.random() - 0.5) * 2))
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (percentage) => {
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBg = (percentage) => {
    if (percentage < 50) return 'bg-green-100';
    if (percentage < 80) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'stopped': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Server className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold">System Health</h2>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* System Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <span className="font-medium">CPU</span>
            </div>
            <span className={`text-sm font-medium ${getHealthColor(systemStats.cpu.usage)}`}>
              {systemStats.cpu.usage.toFixed(1)}%
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Usage</span>
              <span>{systemStats.cpu.cores} cores</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${systemStats.cpu.usage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Temperature</span>
              <span>{systemStats.cpu.temperature}°C</span>
            </div>
          </div>
        </div>

        {/* Memory */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MemoryStick className="w-5 h-5 text-green-600" />
              <span className="font-medium">Memory</span>
            </div>
            <span className={`text-sm font-medium ${getHealthColor(systemStats.memory.percentage)}`}>
              {systemStats.memory.percentage.toFixed(1)}%
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used</span>
              <span>{systemStats.memory.used.toFixed(1)} GB / {systemStats.memory.total} GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${systemStats.memory.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Disk */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Disk</span>
            </div>
            <span className={`text-sm font-medium ${getHealthColor(systemStats.disk.percentage)}`}>
              {systemStats.disk.percentage.toFixed(1)}%
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used</span>
              <span>{systemStats.disk.used} GB / {systemStats.disk.total} GB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${systemStats.disk.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Network */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-orange-600" />
              <span className="font-medium">Network</span>
            </div>
            <span className="text-sm font-medium text-green-600">
              {systemStats.network.latency}ms
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Upload</span>
              <span>{systemStats.network.upload.toFixed(1)} MB/s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Download</span>
              <span>{systemStats.network.download.toFixed(1)} MB/s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Services Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemStats.services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getStatusIcon(service.status)}
                <div>
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-gray-500">Uptime: {service.uptime}</div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                service.status === 'running' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {service.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Database Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Database Performance</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{systemStats.database.connections}</div>
            <div className="text-sm text-gray-600">Active Connections</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{systemStats.database.queries.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Queries Today</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{systemStats.database.uptime}</div>
            <div className="text-sm text-gray-600">Uptime</div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold">System Alerts</h3>
          </div>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
            {alerts.length} Active
          </span>
        </div>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <div className="font-medium">{alert.message}</div>
                <div className="text-sm text-gray-500">{alert.timestamp.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
