import React from 'react';
import { Activity, Moon, Sun, Wifi, WifiOff, Play, Square, ChevronDown, RotateCcw } from 'lucide-react';

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
  onReset
}) => {
  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* App Name */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-8 h-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Sentinel-X
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

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Interface Selector */}
            <div className="relative">
              <select
                value={selectedInterface}
                onChange={(e) => onInterfaceChange(e.target.value)}
                className="glass-select text-gray-900 dark:text-white px-4 py-2 pr-8"
              >
                {interfaces.map((iface) => (
                  <option key={iface} value={iface}>
                    {iface}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-500" />
            </div>

            {/* Capture Button */}
            <button
              onClick={isCapturing ? onStopCapture : onStartCapture}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isCapturing
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isCapturing ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start</span>
                </>
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="glass-button flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20"
              title="Reset Application"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
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
      </div>
    </nav>
  );
};

export default Navbar;
