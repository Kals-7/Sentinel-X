import React, { useState } from 'react';
import { Activity, Moon, Sun, Wifi, WifiOff, Play, Square, ChevronDown, RotateCcw, Shield, Users, Server, FileText, Settings, Menu, X, QrCode } from 'lucide-react';

const Navbar = ({
  appName,
  isCapturing,
  selectedInterface,
  interfaces,
  onInterfaceChange,
  onStartCapture,
  onStopCapture,
  onThemeToggle,
  theme,
  isConnected,
  onReset,
  currentView,
  onViewChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'security', name: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'users', name: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'health', name: 'Health', icon: <Server className="w-4 h-4" /> },
    { id: 'audit', name: 'Audit', icon: <FileText className="w-4 h-4" /> },
    { id: 'qrcode', name: 'Mobile Test', icon: <QrCode className="w-4 h-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];
  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* App Name & Mobile Menu */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Sentinel-X Enterprise
              </h1>
            </div>
            <div className="flex items-center space-x-1">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20'
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Interface Selector - Desktop Only */}
            <div className="hidden sm:block relative">
              <select
                value={selectedInterface}
                onChange={(e) => onInterfaceChange(e.target.value)}
                className="glass-select text-gray-900 dark:text-white px-3 py-2 pr-8 text-sm"
                title="Select network interface for packet capture"
              >
                {interfaces.map((iface) => (
                  <option key={iface.id} value={iface.id}>
                    {iface.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
            </div>

            {/* Capture Button */}
            <button
              onClick={isCapturing ? onStopCapture : onStartCapture}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                isCapturing
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isCapturing ? (
                <>
                  <Square className="w-4 h-4" />
                  <span className="hidden sm:inline">Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Start</span>
                </>
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="glass-button p-2 text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-800/20"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
              
              {/* Mobile Interface Selector */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Interface
                </label>
                <select
                  value={selectedInterface}
                  onChange={(e) => onInterfaceChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {interfaces.map((iface) => (
                    <option key={iface.id} value={iface.id}>
                      {iface.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
