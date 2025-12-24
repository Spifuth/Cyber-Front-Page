import { useState, useEffect } from 'react';
import { useDataFetch } from '../hooks';
import {
  PageLayout,
  PageHeader,
  PageContent,
  LoadingSpinner,
  SectionCard,
  SectionTitle,
  FilterButton,
  StatBox
} from '../components/shared';
import { getLogLevelColor, getSeverityColor } from '../lib/utils';

/**
 * LogsPage - System logs and security events monitoring
 */
const LogsPage = () => {
  const { data: logsData, setData: setLogsData, loading } = useDataFetch('logs', (data) => data);
  const [filter, setFilter] = useState('all');
  const [isLive, setIsLive] = useState(false);

  // Live mode simulation
  useEffect(() => {
    let interval;
    if (isLive && logsData) {
      interval = setInterval(() => {
        const newLog = {
          timestamp: new Date().toISOString(),
          level: ['INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 3)],
          service: ['traefik', 'docker', 'fail2ban', 'monitoring'][Math.floor(Math.random() * 4)],
          message: [
            'Health check completed successfully',
            'SSL certificate check passed',
            'System performance within normal parameters',
            'Log rotation completed',
            'Backup process initiated'
          ][Math.floor(Math.random() * 5)],
          source: 'live-monitor'
        };

        setLogsData((prev) => ({
          ...prev,
          systemLogs: [newLog, ...(prev?.systemLogs || []).slice(0, 49)]
        }));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLive, logsData, setLogsData]);

  if (loading) {
    return <LoadingSpinner icon="📊" message="Loading system logs..." />;
  }

  const systemLogs = logsData?.systemLogs || [];
  const securityEvents = logsData?.securityEvents || [];
  const filteredLogs = filter === 'all' 
    ? systemLogs 
    : systemLogs.filter((log) => log.level === filter);

  const formatTimestamp = (ts) => new Date(ts).toLocaleString();
  
  const getRelativeTime = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getLogCount = (level) => level === 'all' 
    ? systemLogs.length 
    : systemLogs.filter((log) => log.level === level).length;

  const errorCount = systemLogs.filter((l) => l.level === 'ERROR' || l.level === 'CRITICAL').length;

  return (
    <PageLayout>
      <PageHeader 
        title="SYSTEM LOGS" 
        subtitle="Real-time Infrastructure Monitoring & Security Events" 
      />

      <PageContent>
        {/* System Status Panel */}
        <SectionCard borderColor="border-green-400" className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <SectionTitle color="text-green-400">🖥️ SYSTEM STATUS</SectionTitle>
            <div className="flex items-center space-x-4">
              <span className="text-green-400">●</span>
              <span className="text-sm">All Systems Operational</span>
              <button
                onClick={() => setIsLive(!isLive)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  isLive 
                    ? 'bg-red-600 text-white animate-pulse' 
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {isLive ? '🔴 LIVE' : '▶️ Start Live Mode'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox 
              value={`${logsData?.uptime?.uptimePercentage || 99.9}%`} 
              label="Uptime" 
              color="text-green-400" 
            />
            <StatBox 
              value={systemLogs.length} 
              label="Log Entries" 
              color="text-blue-400" 
            />
            <StatBox 
              value={securityEvents.length} 
              label="Security Events" 
              color="text-yellow-400" 
            />
            <StatBox 
              value={errorCount} 
              label="Errors" 
              color="text-red-400" 
            />
          </div>
        </SectionCard>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap justify-center gap-4">
          {['all', 'INFO', 'WARN', 'ERROR', 'CRITICAL'].map((level) => (
            <FilterButton
              key={level}
              active={filter === level}
              onClick={() => setFilter(level)}
            >
              {level === 'all' ? 'All Logs' : level} ({getLogCount(level)})
            </FilterButton>
          ))}
        </div>

        {/* Logs Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* System Logs */}
          <div className="lg:col-span-2">
            <SectionTitle color="text-blue-400">📋 SYSTEM LOGS</SectionTitle>
            <SectionCard borderColor="border-blue-400" className="max-h-96 overflow-y-auto p-4">
              {filteredLogs.map((log, index) => (
                <div key={index} className="mb-3 border-b border-gray-800 pb-3">
                  <div className="flex justify-between">
                    <span className={`px-2 py-1 rounded text-xs ${getLogLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="text-gray-500 text-xs">{formatTimestamp(log.timestamp)}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-green-300">[{log.service}] {log.message}</div>
                    <div className="text-xs text-gray-500">Source: {log.source}</div>
                  </div>
                </div>
              ))}
            </SectionCard>
          </div>

          {/* Security Events */}
          <div>
            <SectionTitle color="text-red-400">⚠️ SECURITY EVENTS</SectionTitle>
            <SectionCard borderColor="border-red-400" className="max-h-96 overflow-y-auto p-4">
              {securityEvents.map((event) => (
                <div key={event.id} className="mb-3 border-b border-gray-800 pb-3">
                  <div className="flex justify-between">
                    <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(event.severity)}`}>
                      {event.severity}
                    </span>
                    <span className="text-gray-500 text-xs">{getRelativeTime(event.timestamp)}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-green-300">{event.title}</div>
                    <div className="text-xs text-gray-500">{event.description}</div>
                    <div className="text-xs text-blue-400 mt-1">Response: {event.response}</div>
                  </div>
                </div>
              ))}
            </SectionCard>
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
};

export default LogsPage;
