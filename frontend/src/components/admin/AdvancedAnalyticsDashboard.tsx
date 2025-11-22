import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useSubscription } from 'react-query';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ScatterChart, Scatter, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

interface RealtimeMetricCardProps {
  title: string;
  value: number | string;
  change: number;
  icon: string;
  color: string;
}

interface TimeframeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

interface MetricSelectorProps {
  selectedMetrics: string[];
  onChange: (metrics: string[]) => void;
}

interface AutoRefreshToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

interface ExportButtonProps {
  data: any;
}

interface CohortTableProps {
  data: any[];
}

interface AnomalyDetectionTableProps {
  anomalies: any[];
}

const RealtimeMetricCard: React.FC<RealtimeMetricCardProps> = ({
  title,
  value,
  change,
  icon,
  color
}) => {
  const changeType = change >= 0 ? 'increase' : 'decrease';
  const changeText = `${Math.abs(change)}% ${changeType} from previous period`;

  return (
    <div 
      className={`bg-white rounded-lg p-6 shadow hover:shadow-lg transition-shadow`}
      role="article"
      aria-labelledby={`metric-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 
          id={`metric-title-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="text-lg font-semibold text-gray-700"
        >
          {title}
        </h4>
        <span className="text-2xl" role="img" aria-label={`${title} icon`}>{icon}</span>
      </div>
      <div className="flex items-baseline">
        <p 
          className={`text-2xl font-bold text-${color}-600`}
          aria-label={`Current value: ${value}`}
        >
          {value}
        </p>
        <span 
          className={`ml-2 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}
          aria-label={changeText}
        >
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
          <span className="sr-only"> from previous period</span>
        </span>
      </div>
    </div>
  );
};

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ value, onChange }) => {
  const options = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  return (
    <div>
      <label htmlFor="timeframe-select" className="sr-only">Select Time Period</label>
      <select
        id="timeframe-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        aria-label="Select time period for analytics"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const MetricSelector: React.FC<MetricSelectorProps> = ({ selectedMetrics, onChange }) => {
  const metrics = [
    { id: 'revenue', label: 'Revenue' },
    { id: 'users', label: 'Users' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'conversion', label: 'Conversion' },
    { id: 'retention', label: 'Retention' }
  ];

  return (
    <fieldset className="flex flex-wrap gap-2" role="group" aria-label="Select metrics to display">
      <legend className="sr-only">Select metrics to display</legend>
      {metrics.map(metric => (
        <div key={metric.id} className="inline-flex items-center">
          <label 
            htmlFor={`metric-${metric.id}`} 
            className="inline-flex items-center cursor-pointer"
          >
            <input
              id={`metric-${metric.id}`}
              type="checkbox"
              checked={selectedMetrics.includes(metric.id)}
              onChange={(e) => {
                const newMetrics = e.target.checked
                  ? [...selectedMetrics, metric.id]
                  : selectedMetrics.filter(m => m !== metric.id);
                onChange(newMetrics);
              }}
              className="rounded text-blue-600 focus:ring-blue-500"
              aria-label={`Show ${metric.label} metrics`}
            />
            <span className="ml-2">{metric.label}</span>
          </label>
        </div>
      ))}
    </fieldset>
  );
};

const AutoRefreshToggle: React.FC<AutoRefreshToggleProps> = ({ enabled, onChange }) => {
  return (
    <label className="inline-flex items-center">
      <span className="mr-2">Auto Refresh</span>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          enabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
};

const ExportButton: React.FC<ExportButtonProps> = ({ data }) => {
  const handleExport = async () => {
    try {
      const response = await fetch('/api/analytics/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics-export.csv';
      a.click();

      // Clean up the URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      // Here you could add proper error handling UI
      alert('Failed to export data. Please try again.');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      aria-label="Export analytics data as CSV"
      title="Download current analytics data as a CSV file"
    >
      <span aria-hidden="true">📥</span> Export Data
    </button>
  );
};

import styles from '../../styles/CohortTable.module.css';

const CohortTable: React.FC<CohortTableProps> = ({ data }) => {
  const getRetentionClass = (rate: number) => {
    const roundedRate = Math.floor(rate / 10) * 10;
    return styles[`retentionCell${roundedRate}`] || styles.retentionCell0;
  };

  return (
    <div className="overflow-x-auto" role="region" aria-label="Cohort Analysis">
      <table className="min-w-full divide-y divide-gray-200" role="table">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cohort
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Users
            </th>
            {[1, 2, 3, 4, 5].map(week => (
              <th scope="col" key={week} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Week {week}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((cohort, index) => (
            <tr key={index} role="row">
              <th scope="row" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {cohort.date}
              </th>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {cohort.users}
              </td>
              {cohort.retention.map((rate: number, weekIndex: number) => (
                <td
                  key={weekIndex}
                  className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${styles.retentionCell} ${getRetentionClass(rate)}`}
                  aria-label={`Week ${weekIndex + 1} retention rate: ${rate}%`}
                >
                  {rate}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AnomalyDetectionTable: React.FC<AnomalyDetectionTableProps> = ({ anomalies }) => {
  const getSeverityAttributes = (severity: string) => {
    const colorClass = severity === 'high' ? 'bg-red-100 text-red-800' :
      severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
      'bg-green-100 text-green-800';
    const description = `${severity} severity anomaly`;
    return { colorClass, description };
  };

  return (
    <div className="overflow-x-auto" role="region" aria-label="Anomaly Detection Results">
      <table 
        className="min-w-full divide-y divide-gray-200"
        role="table"
        aria-label="Detected anomalies in analytics data"
      >
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timestamp
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Metric
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expected Range
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Severity
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {anomalies.map((anomaly, index) => {
            const { colorClass, description } = getSeverityAttributes(anomaly.severity);
            return (
              <tr key={index} role="row">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <time dateTime={new Date(anomaly.timestamp).toISOString()}>
                    {new Date(anomaly.timestamp).toLocaleString()}
                  </time>
                </td>
                <th scope="row" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {anomaly.metric}
                </th>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {anomaly.value}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span aria-label={`Expected range between ${anomaly.expectedRange.min} and ${anomaly.expectedRange.max}`}>
                    {anomaly.expectedRange.min} - {anomaly.expectedRange.max}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}
                    role="status"
                    aria-label={description}
                  >
                    {anomaly.severity}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const fetchAdvancedAnalytics = async (timeframe: string, metrics: string[]) => {
  const response = await fetch('/api/analytics/comprehensive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeframe, metrics })
  });
  return response.json();
};

const fetchPredictiveAnalytics = async (timeframe: string) => {
  const response = await fetch('/api/analytics/predictive', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeframe })
  });
  return response.json();
};

export function AdvancedAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('30d');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedMetrics, setSelectedMetrics] = useState(['revenue', 'users', 'engagement']);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const { data: realTimeData } = useSubscription(
    ['realtime-metrics'],
    () => new Promise((resolve) => {
      setTimeout(() => resolve({
        activeUsers: Math.floor(Math.random() * 100) + 500,
        currentRevenue: Math.random() * 1000,
        newSignups: Math.floor(Math.random() * 10)
      }), 1000);
    }),
    {
      enabled: autoRefresh,
      refetchInterval: 5000
    }
  );

  const { data: comprehensiveData, isLoading } = useQuery(
    ['advanced-analytics', timeframe, selectedMetrics],
    () => fetchAdvancedAnalytics(timeframe, selectedMetrics),
    {
      refetchInterval: autoRefresh ? 30000 : false
    }
  );

  const { data: predictiveData } = useQuery(
    ['predictive-analytics', timeframe],
    () => fetchPredictiveAnalytics(timeframe)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div ref={dashboardRef} className="advanced-analytics-dashboard space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
          <MetricSelector
            selectedMetrics={selectedMetrics}
            onChange={setSelectedMetrics}
          />
        </div>
        <div className="flex items-center space-x-4">
          <AutoRefreshToggle
            enabled={autoRefresh}
            onChange={setAutoRefresh}
          />
          <ExportButton data={comprehensiveData} />
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RealtimeMetricCard
          title="Active Users"
          value={realTimeData?.activeUsers || 0}
          change={+12.5}
          icon="👥"
          color="blue"
        />
        <RealtimeMetricCard
          title="Current Revenue"
          value={`$${realTimeData?.currentRevenue?.toFixed(2) || '0.00'}`}
          change={+8.3}
          icon="💰"
          color="green"
        />
        <RealtimeMetricCard
          title="New Signups"
          value={realTimeData?.newSignups || 0}
          change={+15.2}
          icon="📈"
          color="purple"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Forecast */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Forecast vs Actual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={predictiveData?.revenueForecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="forecast"
                fill="#8884d8"
                stroke="#8884d8"
                fillOpacity={0.3}
                name="Forecast"
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Actual"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* User Behavior Radar */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Engagement Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={comprehensiveData?.userBehaviorRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar
                name="Current"
                dataKey="current"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="Target"
                dataKey="target"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.3}
              />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Cohort Analysis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Retention Cohorts</h3>
          <CohortTable data={comprehensiveData?.cohortAnalysis || []} />
        </div>

        {/* Geographic Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Geographic Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={comprehensiveData?.geographicData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="longitude" type="number" />
              <YAxis dataKey="latitude" type="number" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter dataKey="users" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Anomaly Detection</h3>
        <AnomalyDetectionTable anomalies={comprehensiveData?.anomalies || []} />
      </div>
    </div>
  );
}