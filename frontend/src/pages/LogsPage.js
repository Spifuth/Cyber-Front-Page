import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogsPage = () => {
  const navigate = useNavigate();
  const [logsData, setLogsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const loadLogsData = async () => {
      try {
        const response = await fetch('/data/logs.json');
        const data = await response.json();
        setLogsData(data);
      } catch (error) {
        console.error('Error loading logs data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLogsData();
  }, []);

  // Simulate live logs
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
        
        setLogsData(prev => ({
          ...prev,
          systemLogs: [newLog, ...prev.systemLogs.slice(0, 49)] // Keep last 50 logs
        }));
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

  const getLevelColor = (level) => {
    const colors = {
      'INFO': 'text-green-400 bg-green-900',
      'WARN': 'text-yellow-400 bg-yellow-900',
      'ERROR': 'text-red-400 bg-red-900',
      'CRITICAL': 'text-red-400 bg-red-900 animate-pulse'
    };
    return colors[level] || 'text-gray-400 bg-gray-900';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'LOW': 'text-blue-400 bg-blue-900',
      'MEDIUM': 'text-yellow-400 bg-yellow-900', 
      'HIGH': 'text-orange-400 bg-orange-900',
      'CRITICAL': 'text-red-400 bg-red-900'
    };
    return colors[severity] || 'text-gray-400 bg-gray-900';
  };

  const filteredLogs = filter === 'all' 
    ? logsData?.systemLogs || []
    : logsData?.systemLogs?.filter(log => log.level === filter) || [];

  const securityEvents = logsData?.securityEvents || [];

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

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
      {/* Header */}
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
        
        {/* System Status Bar */}
        <div className="mb-8 bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-green-400">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-400">🖥️ SYSTEM STATUS</h2>
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
                {logsData?.systemLogs?.filter(log => log.level === 'ERROR' || log.level === 'CRITICAL').length || 0}
              </div>
              <div className="text-gray-400">Errors</div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mb-6 flex flex-wrap justify-center gap-4">
          {['all', 'INFO', 'WARN', 'ERROR', 'CRITICAL'].map(level => {
            const count = level === 'all' 
              ? logsData?.systemLogs?.length || 0
              : logsData?.systemLogs?.filter(log => log.level === level).length || 0;
            
            return (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`px-4 py-2 rounded transition-colors ${
                  filter === level 
                    ? 'bg-green-400 text-black' 
                    : 'bg-gray-800 text-green-400 hover:bg-gray-700'
                }`}
              >
                {level === 'all' ? 'All Logs' : level} ({count})
              </button>
            );
          })}
        </div>

        {/* Logs Display */}
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* System Logs */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4 text-blue-400">📋 SYSTEM LOGS</h3>
            <div className="bg-gray-900 bg-opacity-50 p-4 rounded-lg border border-blue-400 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {filteredLogs.slice(0, 20).map((log, index) => (
                  <div key={index} className="flex items-start space-x-3 text-sm border-b border-gray-700 pb-2">
                    <span className="text-gray-500 font-mono text-xs w-16 flex-shrink-0">
                      {getRelativeTime(log.timestamp)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${getLevelColor(log.level)} bg-opacity-30 font-bold w-16 text-center flex-shrink-0`}>
                      {log.level}
                    </span>
                    <span className="text-purple-400 w-20 flex-shrink-0 text-xs">
                      {log.service}
                    </span>
                    <span className="text-gray-300 flex-1 leading-tight">
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Events */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-red-400">🛡️ SECURITY EVENTS</h3>
            <div className="space-y-3">
              {securityEvents.slice(0, 10).map((event, index) => (
                <div key={index} className={`p-3 rounded border ${getSeverityColor(event.severity)} bg-opacity-20 border-opacity-50`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 text-xs rounded ${getSeverityColor(event.severity)} bg-opacity-50 font-bold`}>
                      {event.severity}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {getRelativeTime(event.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-white mb-1">{event.eventType.replace('_', ' ')}</div>
                    <div className="text-gray-300 text-xs mb-1">{event.description}</div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">From: {event.source}</span>
                      <span className="text-yellow-400">{event.action}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Uptime Information */}
        <div className="mt-8 border border-green-400 p-6 rounded-lg bg-gray-900 bg-opacity-30">
          <h3 className="text-xl font-bold mb-4 text-green-400">⏱️ UPTIME INFORMATION</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Current Uptime:</span>
              <p className="text-green-400 font-bold">{logsData?.uptime?.currentUptime}</p>
            </div>
            <div>
              <span className="text-gray-400">Last Reboot:</span>
              <p className="text-yellow-400">{logsData?.uptime?.lastReboot}</p>
            </div>
            <div>
              <span className="text-gray-400">System Started:</span>
              <p className="text-blue-400">{formatTimestamp(logsData?.uptime?.startTime)}</p>
            </div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="text-center py-8 border-t border-gray-700 mt-8">
          <p className="text-gray-500">
            [ Run <span className="text-green-400">logs</span> command in terminal for live tail ]
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Logs updated in real-time • Retention: 30 days
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogsPage;