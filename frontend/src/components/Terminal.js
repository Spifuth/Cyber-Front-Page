import React, { useState, useEffect, useRef } from 'react';
import { mockData } from '../mock/data';

export default function Terminal({ onNavigateToUnderground, onNavigateToKrbtgt, onNavigateToSelfDestruct }) {
  const [history, setHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDir, setCurrentDir] = useState('/home/fenrir');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const { terminalCommands, neofetchData, fileSystem, motdMessages, commandHistory } = mockData;

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Welcome message with random MOTD
  useEffect(() => {
    const randomMotd = motdMessages[Math.floor(Math.random() * motdMessages.length)];
    setHistory([
      { type: 'output', content: 'NebulaHost Terminal v2.1.0' },
      { type: 'output', content: `Today's wisdom: "${randomMotd}"` },
      { type: 'output', content: 'Type "help" for available commands.' },
      { type: 'output', content: '' }
    ]);
  }, [motdMessages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  });

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const formatTime = (date) => {
    return date.toTimeString().slice(0, 8);
  };

  const getPrompt = () => {
    const time = formatTime(currentTime);
    const shortDir = currentDir.replace('/home/fenrir', '~');
    return `fenrir@nebula:${shortDir} [${time}]$ `;
  };

  const typeWriter = (text, callback, speed = 15) => {
    setIsTyping(true);
    let i = 0;
    
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        setHistory(prev => {
          const newHistory = [...prev];
          const lastEntry = newHistory[newHistory.length - 1];
          if (lastEntry && lastEntry.type === 'typing') {
            lastEntry.content = text.slice(0, i + 1);
          } else {
            newHistory.push({ type: 'typing', content: text.slice(0, i + 1) });
          }
          return newHistory;
        });
        i++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        if (callback) callback();
      }
    }, speed);
  };

  const executeNmapScan = () => {
    const randomPort = Math.floor(Math.random() * 9000) + 1000;
    const nmapOutput = `Starting Nmap 7.93 ( https://nmap.org )
Nmap scan report for nebulahost.tech (127.0.0.1)
Host is up (0.0010s latency).
Not shown: 996 closed ports

PORT     STATE    SERVICE
22/tcp   open     ssh
80/tcp   open     http  
443/tcp  open     https
${randomPort}/tcp  filtered elite

Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds`;
    
    typeWriter(nmapOutput, null, 20);
  };

  const executeHelp = () => {
    const commands = [
      ['help', 'Show this help message'],
      ['whoami', 'Display current user'],
      ['pwd', 'Show current directory'],
      ['ls', 'List directory contents'],
      ['cd <dir>', 'Change directory'],
      ['cat <file>', 'Display file contents'],
      ['nmap <host>', 'Scan for open ports'],
      ['neofetch', 'Display system information'],
      ['curl <url>', 'Make HTTP request'],
      ['krbtgt roasting', 'Launch Kerberos attack'],
      ['selfdestruct', 'Trigger system meltdown'],
      ['clear', 'Clear terminal screen'],
      ['exit', 'Close terminal session']
    ];
    
    let helpText = 'Available commands:\n\n';
    commands.forEach(([cmd, desc]) => {
      const paddedCmd = cmd.padEnd(16);
      helpText += `${paddedCmd} ${desc}\n`;
    });
    
    setHistory(prev => [...prev, { type: 'output', content: helpText }]);
  };

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Add command to history
    setHistory(prev => [...prev, { type: 'command', content: `${getPrompt()}${cmd}` }]);

    if (trimmedCmd === '') return;

    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    if (trimmedCmd === 'help') {
      executeHelp();
      return;
    }

    if (trimmedCmd === 'nmap nebulahost.tech') {
      executeNmapScan();
      return;
    }

    if (trimmedCmd.startsWith('cd ')) {
      const path = trimmedCmd.substring(3).trim();
      if (path === 'underground') {
        typeWriter('Access granted. Redirecting to secure zone...', () => {
          setTimeout(() => {
            if (onNavigateToUnderground) {
              onNavigateToUnderground();
            }
          }, 1000);
        });
        return;
      }
      
      // Handle other directory changes
      if (path === '~' || path === '') {
        setCurrentDir('/home/fenrir');
        setHistory(prev => [...prev, { type: 'output', content: '' }]);
      } else if (path === '..') {
        const parentDir = currentDir.split('/').slice(0, -1).join('/') || '/';
        setCurrentDir(parentDir);
        setHistory(prev => [...prev, { type: 'output', content: '' }]);
      } else {
        const newPath = currentDir + '/' + path;
        if (fileSystem[newPath]) {
          setCurrentDir(newPath);
          setHistory(prev => [...prev, { type: 'output', content: '' }]);
        } else {
          setHistory(prev => [...prev, { type: 'error', content: `cd: ${path}: No such file or directory` }]);
        }
      }
      return;
    }

    if (trimmedCmd === 'ls') {
      const currentFiles = fileSystem[currentDir] || ['Directory not found'];
      const output = currentFiles.join('  ');
      setHistory(prev => [...prev, { type: 'output', content: output }]);
      return;
    }

    if (trimmedCmd.startsWith('cat ')) {
      const filename = trimmedCmd.substring(4).trim();
      const catCommand = `cat ${filename}`;
      if (terminalCommands[catCommand]) {
        setHistory(prev => [...prev, { type: 'output', content: terminalCommands[catCommand] }]);
      } else {
        setHistory(prev => [...prev, { type: 'error', content: `cat: ${filename}: No such file or directory` }]);
      }
      return;
    }

    if (trimmedCmd === 'neofetch') {
      const neofetchOutput = `
                   _,met$$$$$gg.          fenrir@nebulahost
                ,g$$$$$$$$$$$$$$$P.       -----------------
              ,g$$P"     """Y$$.".        OS: ${neofetchData.os}
             ,$$P'              \`$$$.     Host: ${neofetchData.host}
            ',$$P       ,ggs.     \`$$b:   Kernel: ${neofetchData.kernel}
            \`d$$'     ,$P"'   .    $$$    Uptime: ${neofetchData.uptime}
             $$P      d$'     ,    $$P    Packages: ${neofetchData.packages}
             $$:      $$.   -    ,d$$'    Shell: ${neofetchData.shell}
             $$;      Y$b._   _,d$P'      Terminal: ${neofetchData.terminal}
             Y$$.    \`.\`"Y$$$$P"'         CPU: ${neofetchData.cpu}
             \`$$b      "-.__              GPU: ${neofetchData.gpu}
              \`Y$$                       Memory: ${neofetchData.memory}
               \`Y$$.                     Disk: ${neofetchData.disk}
                 \`$$b.                   Local IP: ${neofetchData.localip}
                   \`Y$$b.                Public IP: ${neofetchData.publicip}
                     \`"Y$b._             Locale: ${neofetchData.locale}
                         \`"""
`;
      typeWriter(neofetchOutput);
      return;
    }

    if (trimmedCmd === 'krbtgt roasting') {
      typeWriter('Initializing Kerberoasting attack... Redirecting to secure terminal...', () => {
        setTimeout(() => {
          if (onNavigateToKrbtgt) {
            onNavigateToKrbtgt();
          }
        }, 1000);
      });
      return;
    }

    if (trimmedCmd === 'selfdestruct') {
      typeWriter('WARNING: Initiating self-destruct sequence... Are you sure about this?', () => {
        setTimeout(() => {
          if (onNavigateToSelfDestruct) {
            onNavigateToSelfDestruct();
          }
        }, 1000);
      });
      return;
    }

    if (trimmedCmd === 'curl ittools.nebulahost.tech') {
      typeWriter('Connecting to IT Tools Suite...', () => {
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: '> Response: 200 OK' }]);
          setHistory(prev => [...prev, { type: 'output', content: '> Content-Type: application/json' }]);
          setHistory(prev => [...prev, { type: 'output', content: '> Redirecting...' }]);
          setTimeout(() => {
            window.open('https://ittools.nebulahost.tech', '_blank');
          }, 1500);
        }, 1000);
      });
      return;
    }

    // Handle other commands
    if (terminalCommands[trimmedCmd]) {
      const output = terminalCommands[trimmedCmd];
      if (Array.isArray(output)) {
        output.forEach(line => {
          setHistory(prev => [...prev, { type: 'output', content: line }]);
        });
      } else {
        setHistory(prev => [...prev, { type: 'output', content: output }]);
      }
    } else {
      setHistory(prev => [...prev, { 
        type: 'error', 
        content: `Command not found: ${cmd}. Type 'help' for available commands.` 
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isTyping) {
      executeCommand(currentCommand);
      setCurrentCommand('');
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  return (
    <div className="h-96 bg-black text-green-400 font-mono text-sm flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-green-500/30">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400">fenrir@nebulahost:{currentDir.replace('/home/fenrir', '~')}</span>
        <span className="text-blue-400 text-xs">{formatTime(currentTime)}</span>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, index) => (
          <div key={index} className={`
            ${entry.type === 'command' ? 'text-blue-400' : ''}
            ${entry.type === 'error' ? 'text-red-400' : ''}
            ${entry.type === 'output' ? 'text-green-400' : ''}
            ${entry.type === 'typing' ? 'text-green-400' : ''}
          `}>
            <pre className="whitespace-pre-wrap font-mono">{entry.content}</pre>
          </div>
        ))}

        {/* Current Input */}
        {!isTyping && (
          <div className="flex items-center text-blue-400">
            <span>{getPrompt()}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-transparent outline-none text-green-400 ml-1"
              autoComplete="off"
              spellCheck="false"
            />
            <span className="animate-pulse">|</span>
          </div>
        )}
      </div>
    </div>
  );
}