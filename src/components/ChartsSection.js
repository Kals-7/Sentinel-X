import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { useChartAnimation } from '../hooks/useChartAnimation';

const ChartsSection = ({ stats }) => {
  // Enhanced data preparation with aggregation
  const processedData = useMemo(() => {
    // Process traffic over time with cumulative data
    const trafficData = (stats.traffic_over_time || []).map((point, index) => ({
      time: new Date(point.timestamp * 1000).toLocaleTimeString(),
      packets: point.count || 0,
      timestamp: point.timestamp
    }));

    // Use pre-aggregated protocol data from backend
    const protocolData = stats.protocol_chart_data || Object.entries(stats.protocol_distribution || {}).map(([protocol, count]) => ({
      name: protocol,
      value: count,
      percentage: stats.total_packets > 0 ? ((count / stats.total_packets) * 100).toFixed(1) : '0'
    }));

    // Use pre-aggregated top IPs data from backend
    const topIPsData = stats.top_ips_chart || (stats.top_ips || []).slice(0, 10).map(([ip, count]) => ({
      ip: ip.length > 15 ? ip.substring(0, 12) + '...' : ip,
      packets: count
    }));

    // Process PPS timeline data
    const ppsData = (stats.pps_timeline || []).map(point => ({
      time: new Date(point.timestamp * 1000).toLocaleTimeString(),
      pps: point.pps || 0
    }));

    return {
      trafficData,
      protocolData,
      topIPsData,
      ppsData
    };
  }, [stats]);

  // Apply smooth animations to chart data
  const animatedTrafficData = useChartAnimation(processedData.trafficData, 500);
  const animatedProtocolData = useChartAnimation(processedData.protocolData, 600);
  const animatedTopIPsData = useChartAnimation(processedData.topIPsData, 400);
  const animatedPpsData = useChartAnimation(processedData.ppsData, 450);

  // Enhanced color palette
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#a855f7'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Enhanced Traffic Over Time Chart with Area */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Network Traffic Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={animatedTrafficData}>
            <defs>
              <linearGradient id="colorPackets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value, index) => index % Math.ceil(animatedTrafficData.length / 5) === 0 ? value : ''}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="packets"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorPackets)"
              animationDuration={500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Protocol Distribution Chart */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Protocol Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={animatedProtocolData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              animationDuration={600}
              animationBegin={0}
            >
              {animatedProtocolData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Top IP Addresses Chart */}
      <div className="glass-card p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top IP Addresses
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={animatedTopIPsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="ip" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="packets" 
              fill="#8b5cf6" 
              radius={[8, 8, 0, 0]}
              animationDuration={400}
              animationBegin={200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* New Packets Per Second Chart */}
      <div className="card p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Packets Per Second
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={animatedPpsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value, index) => index % Math.ceil(animatedPpsData.length / 6) === 0 ? value : ''}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="pps"
              stroke="#10b981"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 8 }}
              animationDuration={450}
              animationBegin={100}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;
