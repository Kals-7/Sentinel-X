import React from 'react';
import { Package, Link, HardDrive, Zap } from 'lucide-react';

const MetricCards = ({ stats }) => {
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const metrics = [
    {
      title: 'Total Packets',
      value: formatNumber(stats.total_packets),
      icon: Package,
      color: 'blue',
      change: stats.total_packets > 0 ? '+12%' : '0%'
    },
    {
      title: 'Active Connections',
      value: formatNumber(stats.active_connections),
      icon: Link,
      color: 'green',
      change: stats.active_connections > 0 ? '+5%' : '0%'
    },
    {
      title: 'Data Transferred',
      value: formatBytes(stats.data_transferred),
      icon: HardDrive,
      color: 'purple',
      change: stats.data_transferred > 0 ? '+8%' : '0%'
    },
    {
      title: 'Packets per Second',
      value: formatNumber(stats.packets_per_second),
      icon: Zap,
      color: 'orange',
      change: stats.packets_per_second > 0 ? '+15%' : '0%'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        icon: 'text-blue-600 dark:text-blue-400',
        text: 'text-blue-600 dark:text-blue-400'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        icon: 'text-green-600 dark:text-green-400',
        text: 'text-green-600 dark:text-green-400'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        icon: 'text-purple-600 dark:text-purple-400',
        text: 'text-purple-600 dark:text-purple-400'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        icon: 'text-orange-600 dark:text-orange-400',
        text: 'text-orange-600 dark:text-orange-400'
      }
    };
    return colors[color];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const colors = getColorClasses(metric.color);
        
        return (
          <div
            key={index}
            className="metric-card group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${colors.bg} transition-all duration-200 group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {metric.value}
                  </p>
                </div>
              </div>
              <div className={`text-sm font-medium ${colors.text}`}>
                {metric.change}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricCards;
