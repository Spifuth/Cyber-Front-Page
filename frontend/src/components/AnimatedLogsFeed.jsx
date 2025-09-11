import React, { useState, useEffect, useRef } from 'react';

const AnimatedLogsFeed = ({ isVisible, onClose }) => {
  const [logs, setLogs] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const logsRef = useRef(null);
  const logIdRef = useRef(0);

  const logTypes = [
    { type: 'INFO', color: 'text-blue-400', weight: 40 },
    { type: 'WARN', color: 'text-yellow-400', weight: 25 },
    { type: 'ERROR', color: 'text-red-400', weight: 15 },
    { type: 'ROAST', color: 'text-purple-400', weight: 5 },
    { type: 'HACK', color: 'text-green-400', weight: 8 },
    { type: 'CRIT', color: 'text-red-500', weight: 2 },
    { type: 'AUTH', color: 'text-cyan-400', weight: 10 },
    { type: 'NET', color: 'text-orange-400', weight: 15 }
  ];

  const logMessages = {
    INFO: [
      'New request from 192.168.0.42',
      'System health check passed',
      'Backup process completed',
      'SSL certificate renewed',
      'User session established',
      'Database connection pooled',
      'Service mesh synchronized',
      'Cache invalidation successful',
      'Log rotation completed',
      'Monitoring agent heartbeat'
    ],
    WARN: [
      'High memory usage detected (87%)',
      'Suspicious login pattern detected',
      'Rate limiting triggered for IP 203.0.113.15',
      'Disk usage above threshold (82%)',
      'Connection timeout for external service',
      'Certificate expires in 7 days',
      'Unusual traffic pattern detected'
    ],
    ERROR: [
      'AES256 hash... corrupted',
      'Failed to authenticate user session',
      'Database connection lost',
      'Service mesh node unreachable',
      'Configuration validation failed',
      'SSL handshake failed',
      'Permission denied for resource access'
    ],
    ROAST: [
      'krbtgt roasting initiated',
      'AS-REP roasting in progress...',
      'Ticket extraction completed',
      'Hash cracking attempt detected',
      'Kerberos authentication bypass',
      'Domain enumeration started'
    ],
    HACK: [
      'Intrusion attempt blocked',
      'Honeypot interaction logged',
      'Port scan detected from 198.51.100.23',
      'Payload analysis in progress',
      'Threat signature updated',
      'IDS rule triggered'
    ],
    CRIT: [
      'SYSTEM BREACH DETECTED',
      'CRITICAL VULNERABILITY EXPLOITED',
      'UNAUTHORIZED ROOT ACCESS',
      'DATA EXFILTRATION ATTEMPT',
      'RANSOMWARE SIGNATURE MATCHED'
    ],
    AUTH: [
      'Multi-factor authentication successful',
      'Password policy violation',
      'Account lockout triggered',
      'Privileged access granted',
      'Session token expired',
      'OAuth validation failed'
    ],
    NET: [
      'Firewall rule updated',
      'VPN tunnel established',
      'Network latency spike detected',
      'BGP route convergence',
      'DNS query rate limiting',
      'Load balancer health check'
    ]
  };

  const generateRandomLog = () => {
    const now = new Date();
    const timestamp = now.toTimeString().split(' ')[0];
    
    // Weighted random selection
    const totalWeight = logTypes.reduce((sum, type) => sum + type.weight, 0);
    let random = Math.random() * totalWeight;
    
    let selectedType = logTypes[0];
    for (const type of logTypes) {
      random -= type.weight;
      if (random <= 0) {
        selectedType = type;
        break;
      }
    }

    const messages = logMessages[selectedType.type];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    return {
      id: ++logIdRef.current,
      timestamp,
      type: selectedType.type,
      color: selectedType.color,
      message,
      ip: Math.random() > 0.7 ? `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}` : null
    };
  };

  useEffect(() => {
    if (!isVisible || isPaused) return;

    const interval = setInterval(() => {
      const newLog = generateRandomLog();
      setLogs(prev => {
        const updated = [...prev, newLog];
        // Keep only last 100 logs for performance
        return updated.slice(-100);
      });
    }, Math.random() * 2000 + 1000); // Random interval between 1-3 seconds

    return () => clearInterval(interval);
  }, [isVisible, isPaused]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 w-96 h-80 bg-black/90 border border-green-500/50 rounded-lg overflow-hidden backdrop-blur-sm z-30">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-800/90 px-4 py-2 border-b border-green-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm font-bold">LIVE LOGS</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-yellow-400 hover:text-yellow-300 text-xs px-2 py-1 border border-yellow-400/50 rounded"
          >
            {isPaused ? '▶️' : '⏸️'}
          </button>
          <button
            onClick={() => setLogs([])}
            className="text-red-400 hover:text-red-300 text-xs px-2 py-1 border border-red-400/50 rounded"
          >
            🗑️
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-xs px-2 py-1 border border-gray-400/50 rounded"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Logs Content */}
      <div 
        ref={logsRef}
        className="h-full overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-gray-800/50"
      >
        {logs.map((log) => (
          <div key={log.id} className="text-xs font-mono flex items-start space-x-2 animate-fadeIn">
            <span className="text-gray-500 flex-shrink-0">[{log.timestamp}]</span>
            <span className={`font-bold flex-shrink-0 ${log.color}`}>[{log.type}]</span>
            <span className="text-gray-300 flex-1 break-words">
              {log.message}
              {log.ip && <span className="text-blue-400 ml-1">({log.ip})</span>}
            </span>
          </div>
        ))}
        
        {logs.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-2xl mb-2">📊</div>
            <p>Waiting for system events...</p>
          </div>
        )}
        
        {isPaused && (
          <div className="text-center text-yellow-400 mt-4">
            <div className="text-xl">⏸️</div>
            <p className="text-xs">Logs paused</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedLogsFeed;