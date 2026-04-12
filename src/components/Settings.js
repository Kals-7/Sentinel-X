import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Bell, Shield, Database, Globe, Palette, Zap, Lock, Key, Eye, EyeOff } from 'lucide-react';

const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      applicationName: 'Sentinel-X',
      version: '2.0.1',
      environment: 'development',
      debugMode: true,
      logLevel: 'info',
      maxPacketRetention: 1000,
      refreshInterval: 2000
    },
    security: {
      enableAuthentication: false,
      sessionTimeout: 3600,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
      enableTwoFactor: false,
      allowedIPs: ['192.168.1.0/24', '10.0.0.0/8'],
      enableRateLimit: true,
      rateLimitPerMinute: 100
    },
    notifications: {
      emailAlerts: true,
      slackWebhook: '',
      alertThreshold: 80,
      enableSystemAlerts: true,
      enableSecurityAlerts: true,
      enablePerformanceAlerts: true,
      dailyReport: true,
      weeklyReport: false
    },
    database: {
      host: 'localhost',
      port: 5432,
      name: 'sentinel_x',
      backupInterval: 24,
      retentionDays: 30,
      enableCompression: true,
      maxConnections: 100
    },
    network: {
      defaultInterface: 'eth0',
      captureBufferSize: 5000,
      maxPacketSize: 1500,
      enablePromiscuousMode: false,
      captureFilter: '',
      enableRealTimeProcessing: true
    }
  });

  const [showPasswords, setShowPasswords] = useState({});
  const [saveStatus, setSaveStatus] = useState('');

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    setSaveStatus('saving');
    // Simulate saving to backend
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1500);
  };

  const resetSettings = () => {
    setSaveStatus('resetting');
    // Reset to default values
    setTimeout(() => {
      setSaveStatus('reset');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 1000);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <Settings className="w-4 h-4" /> },
    { id: 'security', name: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'database', name: 'Database', icon: <Database className="w-4 h-4" /> },
    { id: 'network', name: 'Network', icon: <Globe className="w-4 h-4" /> }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Application Name</label>
          <input
            type="text"
            value={settings.general.applicationName}
            onChange={(e) => handleSettingChange('general', 'applicationName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
          <select
            value={settings.general.environment}
            onChange={(e) => handleSettingChange('general', 'environment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
          <select
            value={settings.general.logLevel}
            onChange={(e) => handleSettingChange('general', 'logLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="debug">Debug</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Packet Retention</label>
          <input
            type="number"
            value={settings.general.maxPacketRetention}
            onChange={(e) => handleSettingChange('general', 'maxPacketRetention', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Interval (ms)</label>
          <input
            type="number"
            value={settings.general.refreshInterval}
            onChange={(e) => handleSettingChange('general', 'refreshInterval', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="debugMode"
            checked={settings.general.debugMode}
            onChange={(e) => handleSettingChange('general', 'debugMode', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="debugMode" className="text-sm font-medium text-gray-700">Enable Debug Mode</label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="enableAuth"
            checked={settings.security.enableAuthentication}
            onChange={(e) => handleSettingChange('security', 'enableAuthentication', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enableAuth" className="text-sm font-medium text-gray-700">Enable Authentication</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (seconds)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password Min Length</label>
          <input
            type="number"
            value={settings.security.passwordMinLength}
            onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="enable2FA"
            checked={settings.security.enableTwoFactor}
            onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enable2FA" className="text-sm font-medium text-gray-700">Enable Two-Factor Auth</label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="enableRateLimit"
            checked={settings.security.enableRateLimit}
            onChange={(e) => handleSettingChange('security', 'enableRateLimit', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enableRateLimit" className="text-sm font-medium text-gray-700">Enable Rate Limiting</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rate Limit (per minute)</label>
          <input
            type="number"
            value={settings.security.rateLimitPerMinute}
            onChange={(e) => handleSettingChange('security', 'rateLimitPerMinute', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Allowed IPs (one per line)</label>
          <textarea
            value={settings.security.allowedIPs.join('\n')}
            onChange={(e) => handleSettingChange('security', 'allowedIPs', e.target.value.split('\n').filter(ip => ip.trim()))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="emailAlerts"
            checked={settings.notifications.emailAlerts}
            onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="emailAlerts" className="text-sm font-medium text-gray-700">Email Alerts</label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slack Webhook URL</label>
          <input
            type="url"
            value={settings.notifications.slackWebhook}
            onChange={(e) => handleSettingChange('notifications', 'slackWebhook', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Alert Threshold (%)</label>
          <input
            type="number"
            value={settings.notifications.alertThreshold}
            onChange={(e) => handleSettingChange('notifications', 'alertThreshold', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="dailyReport"
            checked={settings.notifications.dailyReport}
            onChange={(e) => handleSettingChange('notifications', 'dailyReport', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="dailyReport" className="text-sm font-medium text-gray-700">Daily Report</label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="weeklyReport"
            checked={settings.notifications.weeklyReport}
            onChange={(e) => handleSettingChange('notifications', 'weeklyReport', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="weeklyReport" className="text-sm font-medium text-gray-700">Weekly Report</label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="systemAlerts"
            checked={settings.notifications.enableSystemAlerts}
            onChange={(e) => handleSettingChange('notifications', 'enableSystemAlerts', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="systemAlerts" className="text-sm font-medium text-gray-700">System Alerts</label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="securityAlerts"
            checked={settings.notifications.enableSecurityAlerts}
            onChange={(e) => handleSettingChange('notifications', 'enableSecurityAlerts', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="securityAlerts" className="text-sm font-medium text-gray-700">Security Alerts</label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="performanceAlerts"
            checked={settings.notifications.enablePerformanceAlerts}
            onChange={(e) => handleSettingChange('notifications', 'enablePerformanceAlerts', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="performanceAlerts" className="text-sm font-medium text-gray-700">Performance Alerts</label>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Host</label>
          <input
            type="text"
            value={settings.database.host}
            onChange={(e) => handleSettingChange('database', 'host', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Port</label>
          <input
            type="number"
            value={settings.database.port}
            onChange={(e) => handleSettingChange('database', 'port', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Database Name</label>
          <input
            type="text"
            value={settings.database.name}
            onChange={(e) => handleSettingChange('database', 'name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Interval (hours)</label>
          <input
            type="number"
            value={settings.database.backupInterval}
            onChange={(e) => handleSettingChange('database', 'backupInterval', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Retention Days</label>
          <input
            type="number"
            value={settings.database.retentionDays}
            onChange={(e) => handleSettingChange('database', 'retentionDays', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Connections</label>
          <input
            type="number"
            value={settings.database.maxConnections}
            onChange={(e) => handleSettingChange('database', 'maxConnections', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="enableCompression"
            checked={settings.database.enableCompression}
            onChange={(e) => handleSettingChange('database', 'enableCompression', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enableCompression" className="text-sm font-medium text-gray-700">Enable Compression</label>
        </div>
      </div>
    </div>
  );

  const renderNetworkSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Default Interface</label>
          <select
            value={settings.network.defaultInterface}
            onChange={(e) => handleSettingChange('network', 'defaultInterface', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="eth0">eth0</option>
            <option value="lo">lo</option>
            <option value="wlan0">wlan0</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Capture Buffer Size</label>
          <input
            type="number"
            value={settings.network.captureBufferSize}
            onChange={(e) => handleSettingChange('network', 'captureBufferSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Packet Size</label>
          <input
            type="number"
            value={settings.network.maxPacketSize}
            onChange={(e) => handleSettingChange('network', 'maxPacketSize', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="promiscuousMode"
            checked={settings.network.enablePromiscuousMode}
            onChange={(e) => handleSettingChange('network', 'enablePromiscuousMode', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="promiscuousMode" className="text-sm font-medium text-gray-700">Enable Promiscuous Mode</label>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="realTimeProcessing"
            checked={settings.network.enableRealTimeProcessing}
            onChange={(e) => handleSettingChange('network', 'enableRealTimeProcessing', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="realTimeProcessing" className="text-sm font-medium text-gray-700">Enable Real-time Processing</label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Capture Filter (BPF syntax)</label>
          <input
            type="text"
            value={settings.network.captureFilter}
            onChange={(e) => handleSettingChange('network', 'captureFilter', e.target.value)}
            placeholder="e.g., port 80 or tcp"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'database': return renderDatabaseSettings();
      case 'network': return renderNetworkSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">System Settings</h2>
          </div>
          <div className="flex items-center space-x-3">
            {saveStatus && (
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                saveStatus === 'saved' ? 'bg-green-100 text-green-800' :
                saveStatus === 'saving' ? 'bg-blue-100 text-blue-800' :
                saveStatus === 'reset' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {saveStatus === 'saved' ? 'Settings Saved' :
                 saveStatus === 'saving' ? 'Saving...' :
                 saveStatus === 'reset' ? 'Settings Reset' :
                 'Ready'}
              </span>
            )}
            <button
              onClick={resetSettings}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={saveSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
