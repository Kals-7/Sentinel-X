import React from 'react';
import { Cpu, HardDrive, Activity, Clock, Database } from 'lucide-react';

const PerformanceMetrics = ({ performance }) => {
  const metrics = [
    {
      title: 'Processing Time',
      value: `${performance.processing_time_avg || 0}ms`,
      icon: Clock,
      color: 'blue',
      description: 'Average packet processing time'
    },
    {
      title: 'Memory Usage',
      value: `${performance.memory_usage || 0}MB`,
      icon: HardDrive,
      color: 'green',
      description: 'Current memory consumption'
    },
    {
      title: 'CPU Usage',
      value: `${performance.cpu_usage || 0}%`,
      icon: Cpu,
      color: 'orange',
      description: 'Current CPU utilization'
    },
    {
      title: 'Queue Size',
      value: performance.queue_size || 0,
      icon: Database,
      color: 'purple',
      description: 'Packets waiting to be processed'
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
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        icon: 'text-orange-600 dark:text-orange-400',
        text: 'text-orange-600 dark:text-orange-400'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        icon: 'text-purple-600 dark:text-purple-400',
        text: 'text-purple-600 dark:text-purple-400'
      }
    };
    return colors[color];
  };

  return (
    <div className="glass-card p-6 floating-glass">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Performance Metrics
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const colors = getColorClasses(metric.color);
          
          return (
            <div key={index} className="text-center">
              <div className={`inline-flex p-3 rounded-lg ${colors.bg} mb-2`}>
                <Icon className={`w-5 h-5 ${colors.icon}`} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {metric.title}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {metric.description}
              </div>
            </div>
          );
        })}
      </div>
      
      {(performance.packets_dropped > 0) && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                Performance Warning
              </span>
            </div>
            <span className="text-sm text-red-600 dark:text-red-400">
              {performance.packets_dropped} packets dropped
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics;
