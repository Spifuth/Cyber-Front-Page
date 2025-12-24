import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCollection } from '../lib/dataClient';
import { getLogLevelColor, getSeverityColor } from '../lib/utils';

const LogsPage = () => {
  const navigate = useNavigate();
  const [logsData, setLogsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const loadLogsData = async () => {
      try {
        const data = await loadCollection('logs');
        setLogsData(data);
      } catch (error) {
        console.error('Error loading logs data:', error);
        setLogsData({ systemLogs: [], securityEvents: [] });
      } finally {
        setLoading(false);
      }
    };

    loadLogsData();
  }, []);

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

        setLogsData((prev) => {
          const current = prev || { systemLogs: [], securityEvents: [] };
          return {
            ...current,
            systemLogs: [newLog, ...(current.systemLogs || []).slice(0, 49)]
          };
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLive, logsData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">📊</div>
            <p>Loading system logs...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredLogs =
    filter === 'all' ? logsData?.systemLogs || [] : logsData?.systemLogs?.filter((log) => log.level === filter) || [];

  const securityEvents = logsData?.securityEvents || [];

  const formatTimestamp = (timestamp) => new Date(timestamp).toLocaleString();

  const getRelativeTime = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="bg-gradient-to-r from-gray-900 to-black border-b-2 border-green-400 p-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-green-400 text-black hover:bg-green-300 transition-colors rounded"
        >
          ← Back to Terminal
        </button>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-green-400">► SYSTEM LOGS</h1>
          <p className="text-gray-400">Real-time Infrastructure Monitoring & Security Events</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8 bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-green-400">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-400">🖥️ SYSTEM STATUS</h2>
            <div className="flex items-center space-x-4">
              <span className="text-green-400">●</span>
              <span className="text-sm">All Systems Operational</span>
              <button
                onClick={() => setIsLive(!isLive)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  isLive ? 'bg-red-600 text-white animate-pulse' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                {isLive ? '🔴 LIVE' : '▶️ Start Live Mode'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
            <div>
              <div className="text-green-400 text-2xl font-bold">{logsData?.uptime?.uptimePercentage}%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
            <div>
              <div className="text-blue-400 text-2xl font-bold">{logsData?.systemLogs?.length || 0}</div>
              <div className="text-gray-400">Log Entries</div>
            </div>
            <div>
              <div className="text-yellow-400 text-2xl font-bold">{securityEvents.length}</div>
              <div className="text-gray-400">Security Events</div>
            </div>
            <div>
              <div className="text-red-400 text-2xl font-bold">
                {logsData?.systemLogs?.filter((log) => log.level === 'ERROR' || log.level === 'CRITICAL').length || 0}
              </div>
              <div className="text-gray-400">Errors</div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-4">
          {['all', 'INFO', 'WARN', 'ERROR', 'CRITICAL'].map((level) => {
            const count =
              level === 'all'
                ? logsData?.systemLogs?.length || 0
                : logsData?.systemLogs?.filter((log) => log.level === level).length || 0;

            return (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-4 py-2 rounded transition-colors ${
                  filter === level ? 'bg-green-400 text-black' : 'bg-gray-800 text-green-400 hover:bg-gray-700'
                }`}
              >
                {level === 'all' ? 'All Logs' : level} ({count})
              </button>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-blue-400">📋 SYSTEM LOGS</h3>
            <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-blue-400 max-h-96 overflow-y-auto">
              {filteredLogs.map((log, index) => (
                <div key={index} className="mb-3 border-b border-gray-800 pb-3">
                  <div className="flex justify-between">
                    <span className={`px-2 py-1 rounded text-xs ${getLogLevelColor(log.level)}`}>{log.level}</span>
                    <span className="text-gray-500 text-xs">{formatTimestamp(log.timestamp)}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-green-300">[{log.service}] {log.message}</div>
                    <div className="text-xs text-gray-500">Source: {log.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-red-400">⚠️ SECURITY EVENTS</h3>
            <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-red-400 max-h-96 overflow-y-auto">
              {securityEvents.map((event) => (
                <div key={event.id} className="mb-3 border-b border-gray-800 pb-3">
                  <div className="flex justify-between">
                    <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(event.severity)}`}>{event.severity}</span>
                    <span className="text-gray-500 text-xs">{getRelativeTime(event.timestamp)}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-green-300">{event.title}</div>
                    <div className="text-xs text-gray-500">{event.description}</div>
                    <div className="text-xs text-blue-400 mt-1">Response: {event.response}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;
