import React, { useState, useEffect } from 'react';
import { QrCode, Smartphone, Wifi, Activity, CheckCircle, AlertCircle } from 'lucide-react';

const QRCodeDisplay = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [connectivityStatus, setConnectivityStatus] = useState('checking');

  useEffect(() => {
    setCurrentUrl(window.location.origin);
    testConnectivity();
  }, []);

  const testConnectivity = async () => {
    setConnectivityStatus('checking');
    try {
      const response = await fetch(`${window.location.origin}/api/stats`);
      if (response.ok) {
        setConnectivityStatus('connected');
      } else {
        setConnectivityStatus('error');
      }
    } catch (error) {
      setConnectivityStatus('error');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateQRCode = () => {
    // This would generate a QR code, but for simplicity, we'll show the URL
    return currentUrl;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <QrCode className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Mobile Test QR Code</h2>
          </div>
          <p className="text-gray-600">
            Scan this QR code with your mobile device to test packet capture
          </p>
        </div>

        {/* QR Code Placeholder */}
        <div className="flex justify-center mb-6">
          <div className="w-64 h-64 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">QR Code for:</p>
              <p className="text-xs text-gray-600 font-mono break-all mt-2 px-2">
                {currentUrl}
              </p>
            </div>
          </div>
        </div>

        {/* URL Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">Direct URL:</p>
              <p className="text-sm text-gray-600 font-mono break-all">{currentUrl}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="ml-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Connectivity Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            {connectivityStatus === 'connected' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : connectivityStatus === 'checking' ? (
              <Activity className="w-5 h-5 text-yellow-500 animate-spin" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <div>
              <p className="font-medium text-gray-900">
                Backend Status: {connectivityStatus === 'connected' ? 'Connected' : 
                              connectivityStatus === 'checking' ? 'Checking...' : 'Disconnected'}
              </p>
              <p className="text-sm text-gray-600">
                {connectivityStatus === 'connected' 
                  ? 'Ready for mobile testing' 
                  : 'Make sure the backend server is running on port 8000'}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Mobile Testing Instructions
          </h3>
          <ol className="space-y-2 text-sm text-blue-800">
            <li>1. Scan the QR code with your mobile device camera</li>
            <li>2. Open the Sentinel-X application in your mobile browser</li>
            <li>3. Click "Start" to begin packet capture</li>
            <li>4. Generate network traffic (browse websites, use apps, make calls)</li>
            <li>5. Watch the real-time packet capture data</li>
            <li>6. Verify that packets from your mobile device are being captured</li>
          </ol>
        </div>

        {/* Test Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={testConnectivity}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Test Connectivity
          </button>
          <button
            onClick={() => window.open(currentUrl, '_blank')}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open in New Tab
          </button>
        </div>

        {/* Network Info */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Wifi className="w-4 h-4 mr-2" />
            Network Information
          </h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Your Network:</strong> {window.location.hostname}</p>
            <p><strong>Mobile Device:</strong> Must be on the same network</p>
            <p><strong>Port:</strong> 3000 (frontend), 8000 (backend)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
