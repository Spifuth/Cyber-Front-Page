import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMockTerminal } from '../mocks/mockBackend';
import AnimatedLogsFeed from './AnimatedLogsFeed';
import { getExternalUrl, isMockEnabled } from '../lib/env';
import { loadCollection } from '../lib/dataClient';

export default function Terminal({ onNavigateToUnderground, onNavigateToKrbtgt, onNavigateToSelfDestruct }) {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDir, setCurrentDir] = useState('/home/fenrir');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [filesystem, setFilesystem] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isTabHidden, setIsTabHidden] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const typingIntervalRef = useRef(null);
  const isTabHiddenRef = useRef(false);

  const terminalData = useMemo(() => getMockTerminal(), []);
  const { terminalCommands, neofetchData, fileSystem, motdMessages, commandHistory } = terminalData;
  const toolsLaunchUrl = useMemo(() => getExternalUrl('VITE_TOOLS_URL', '#'), []);
  const mockMode = isMockEnabled();

  useEffect(() => {
    const loadFilesystem = async () => {
      try {
        const data = await loadCollection('filesystem');
        setFilesystem(data.filesystem ?? null);
        if (mockMode && !data.filesystem) {
          setFilesystem({ directories: {}, files: {} });
        }
      } catch (error) {
        console.error('Error loading filesystem:', error);
        setFilesystem(null);
      }
    };
    loadFilesystem();
  }, [mockMode]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const handleVisibilityChange = () => {
      const hidden = document.visibilityState === 'hidden';
      isTabHiddenRef.current = hidden;
      setIsTabHidden(hidden);
    };

    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isTabHidden) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [isTabHidden]);

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

  const formatTime = (date) => date.toTimeString().slice(0, 8);

  const getPrompt = () => {
    const time = formatTime(currentTime);
    const shortDir = currentDir.replace('/home/fenrir', '~');
    return `fenrir@nebula:${shortDir} [${time}]$ `;
  };

  const typeWriter = (text, callback, speed = 15) => {
    setIsTyping(true);
    let i = 0;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    typingIntervalRef.current = setInterval(() => {
      if (isTabHiddenRef.current) {
        return;
      }

      if (i < text.length) {
        setHistory((prev) => {
          const newHistory = [...prev];
          const lastEntry = newHistory[newHistory.length - 1];
          if (lastEntry && lastEntry.type === 'typing') {
            lastEntry.content = text.slice(0, i + 1);
          } else {
            newHistory.push({ type: 'typing', content: text.slice(0, i + 1) });
          }
          return newHistory;
        });
        i += 1;
      } else {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsTyping(false);
        if (callback) callback();
      }
    }, speed);
  };

  useEffect(() => () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
  }, []);

  const executeNmapScan = (target = 'nebulahost.tech') => {
    const randomPort = Math.floor(Math.random() * 9000) + 1000;
    const nmapOutput = `Starting Nmap 7.93 ( https://nmap.org )
Nmap scan report for ${target} (127.0.0.1)
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
      ['pwd', 'Show current directory path'],
      ['ls', 'List directory contents'],
      ['cd <dir>', 'Change directory location'],
      ['cat <file>', 'Display file contents'],
      ['clear', 'Clear terminal screen'],
      ['exit', 'Close terminal session'],
      ['neofetch', 'Display system information'],
      ['nmap <host>', 'Network port scanner'],
      ['curl <url>', 'Make HTTP requests'],
      ['resume', 'View professional resume'],
      ['timeline', 'Show career timeline'],
      ['stack', 'Display technology stack'],
      ['skills', 'Show skills radar chart'],
      ['infra', 'View infrastructure setup'],
      ['certs', 'List certifications'],
      ['contact', 'Show contact information'],
      ['learning', 'Display learning resources'],
      ['projects', 'Navigate to projects page'],
      ['logs', 'Toggle live system logs'],
      ['matrix', 'Enter the Matrix'],
      ['hackername', 'Generate hacker alias'],
      ['music', 'Play synthwave radio'],
      ['mirror', 'System analysis with attitude'],
      ['vault', 'Access encrypted vault'],
      ['decrypt <file>', 'Decrypt vault files'],
      ['krbtgt roasting', 'Launch Kerberos attack'],
      ['selfdestruct', 'Trigger system meltdown']
    ];

    let helpText = '┌────────────────────────────────────────────────────────────────┐\n';
    helpText += '│                    NEBULAHOST COMMAND CENTER                   │\n';
    helpText += '├────────────────────────────────────────────────────────────────┤\n';

    commands.forEach(([cmd, desc]) => {
      const cmdPadded = cmd.padEnd(18);
      helpText += `│ ${cmdPadded} ${desc.padEnd(43)} │\n`;
    });

    helpText += '└────────────────────────────────────────────────────────────────┘';

    setHistory((prev) => [...prev, { type: 'output', content: helpText }]);
  };

  const sanitizeInput = (input) =>
    input.replace(/[<>&"']/g, '').replace(/\.\./g, '').slice(0, 200).trim();

  const validateCommand = (cmd) => {
    const allowedCommands = [
      'help', 'whoami', 'pwd', 'ls', 'clear', 'exit', 'neofetch',
      'resume', 'timeline', 'stack', 'skills', 'infra', 'certs', 'contact',
      'learning', 'logs', 'projects', 'hackername', 'music',
      'mirror', 'matrix', 'vault', 'selfdestruct', 'krbtgt roasting'
    ];

    const allowedPrefixes = ['cd ', 'cat ', 'nmap ', 'curl ', 'decrypt '];

    return allowedCommands.includes(cmd) || allowedPrefixes.some((prefix) => cmd.startsWith(prefix));
  };

  const executeCommand = (cmd) => {
    const sanitizedCmd = sanitizeInput(cmd);
    const trimmedCmd = sanitizedCmd.toLowerCase();

    setHistory((prev) => [...prev, { type: 'command', content: `${getPrompt()}${sanitizedCmd}` }]);

    if (trimmedCmd === '') return;

    if (!validateCommand(trimmedCmd)) {
      setHistory((prev) => [
        ...prev,
        {
          type: 'error',
          content: `Command not recognized: ${sanitizedCmd}. Type 'help' for available commands.`
        }
      ]);
      return;
    }

    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    if (trimmedCmd === 'help') {
      executeHelp();
      return;
    }

    if (trimmedCmd.startsWith('nmap ')) {
      const target = trimmedCmd.substring(5).trim();
      executeNmapScan(target || 'localhost');
      return;
    }

    if (trimmedCmd === 'pwd') {
      setHistory((prev) => [...prev, { type: 'output', content: currentDir }]);
      return;
    }

    if (trimmedCmd === 'whoami') {
      setHistory((prev) => [...prev, { type: 'output', content: 'fenrir' }]);
      return;
    }

    if (trimmedCmd === 'exit') {
      typeWriter('Connection terminated. Goodbye!', () => {
        setTimeout(() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = '/';
          }
        }, 1000);
      });
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

      if (path === '~' || path === '') {
        setHistory((prev) => [...prev, { type: 'output', content: 'Hint: This terminal is focused on commands, not navigation. Try "help" for available commands.' }]);
      } else if (path === '..') {
        setHistory((prev) => [...prev, { type: 'output', content: 'Hint: Directory navigation is limited. Use specific commands to access content.' }]);
      } else {
        setHistory((prev) => [...prev, { type: 'output', content: `Hint: "${path}" is not accessible. Try "help" to see available commands.` }]);
      }
      return;
    }

    if (trimmedCmd === 'ls') {
      let output = '';
      if (filesystem?.directories?.[currentDir]) {
        const dir = filesystem.directories[currentDir];
        const filesOnly = (dir.contents || []).filter((item) => {
          const potentialPath = currentDir.endsWith('/') ? currentDir + item : `${currentDir}/${item}`;
          return !filesystem.directories[potentialPath];
        });
        output = filesOnly.length > 0 ? filesOnly.join('  ') : 'No files found';
      } else if (fileSystem[currentDir]) {
        const filesOnly = fileSystem[currentDir].filter((item) => !item.endsWith('/'));
        output = filesOnly.length > 0 ? filesOnly.join('  ') : 'No files found';
      } else {
        output = 'Directory not found';
      }
      setHistory((prev) => [...prev, { type: 'output', content: output }]);
      return;
    }

    if (trimmedCmd.startsWith('cat ')) {
      const filename = trimmedCmd.substring(4).trim();
      const filePath = filename.startsWith('/') ? filename : `${currentDir}/${filename}`;

      if (filesystem?.files?.[filePath]) {
        const fileContent = filesystem.files[filePath].content;
        setHistory((prev) => [...prev, { type: 'output', content: fileContent }]);
      } else if (terminalCommands[`cat ${filename}`]) {
        setHistory((prev) => [...prev, { type: 'output', content: terminalCommands[`cat ${filename}`] }]);
      } else {
        setHistory((prev) => [...prev, { type: 'error', content: `cat: ${filename}: No such file or directory` }]);
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

    if (trimmedCmd.startsWith('curl ')) {
      const url = trimmedCmd.substring(5).trim();
      if (url.includes('ittools') || url.includes('tools')) {
        typeWriter('Connecting to IT Tools Suite...', () => {
          setTimeout(() => {
            setHistory((prev) => [...prev, { type: 'output', content: '> Response: 200 OK' }]);
            setHistory((prev) => [...prev, { type: 'output', content: '> Content-Type: application/json' }]);
            setHistory((prev) => [...prev, { type: 'output', content: '> Redirecting...' }]);
            if (toolsLaunchUrl !== '#') {
              setTimeout(() => {
                window.open(toolsLaunchUrl, '_blank');
              }, 1500);
            }
          }, 1000);
        });
      } else {
        typeWriter(`Connecting to ${url}...`, () => {
          setTimeout(() => {
            setHistory((prev) => [...prev, { type: 'output', content: '> Response: 200 OK' }]);
            setHistory((prev) => [...prev, { type: 'output', content: '> Connection successful' }]);
          }, 500);
        });
      }
      return;
    }

    if (trimmedCmd === 'resume') {
      typeWriter('Loading professional resume...', () => {
        setTimeout(() => navigate('/resume'), 1000);
      });
      return;
    }

    if (trimmedCmd === 'timeline') {
      typeWriter('Accessing career timeline...', () => {
        setTimeout(() => navigate('/timeline'), 1000);
      });
      return;
    }

    if (trimmedCmd === 'stack') {
      typeWriter('Displaying technology stack...', () => {
        setTimeout(() => navigate('/stack'), 1000);
      });
      return;
    }

    if (trimmedCmd === 'infra') {
      typeWriter('Loading infrastructure diagram...', () => {
        setTimeout(() => navigate('/infra'), 1000);
      });
      return;
    }

    if (trimmedCmd === 'certs') {
      typeWriter('Retrieving certification records...', () => {
        setTimeout(() => navigate('/certs'), 1000);
      });
      return;
    }

    if (trimmedCmd === 'contact') {
      typeWriter('Opening secure communication channels...', () => {
        setTimeout(() => navigate('/contact'), 1000);
      });
      return;
    }

    if (trimmedCmd === 'learning') {
      typeWriter('Accessing learning resources database...', () => {
        setTimeout(() => navigate('/learning'), 1000);
      });
      return;
    }

    if (trimmedCmd === 'logs') {
      const nextState = !showLogs;
      setShowLogs(nextState);
      typeWriter(`Live logs ${nextState ? 'enabled' : 'disabled'}. System monitoring ${nextState ? 'active' : 'paused'}.`);
      return;
    }

    if (trimmedCmd === 'projects') {
      typeWriter('Accessing project portfolio...', () => {
        setTimeout(() => {
          const projectsSection = document.getElementById('projects');
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
            setHistory((prev) => [...prev, { type: 'output', content: 'Scrolled to projects section. Use browser to view full portfolio.' }]);
          } else {
            setHistory((prev) => [...prev, { type: 'output', content: 'Projects section found. Check the main page for project gallery.' }]);
          }
        }, 1000);
      });
      return;
    }

    if (trimmedCmd === 'skills') {
      typeWriter('Accessing skills matrix... Analyzing competency levels...', () => {
        setTimeout(() => navigate('/skills'), 1000);
      });
      return;
    }

    if (trimmedCmd === 'matrix') {
      typeWriter('Entering the Matrix...', () => {
        setMatrixActive(true);
        setTimeout(() => {
          setHistory((prev) => [...prev, { type: 'output', content: generateMatrixRain() }]);
          setTimeout(() => setMatrixActive(false), 5000);
        }, 1000);
      });
      return;
    }

    if (trimmedCmd === 'hackername') {
      const prefixes = ['Cyber', 'Dark', 'Neo', 'Zero', 'Phantom', 'Ghost', 'Shadow', 'Digital'];
      const suffixes = ['Wolf', 'Hawk', 'Fox', 'Viper', 'Reaper', 'Hunter', 'Blade', 'Storm'];
      const numbers = ['01', '13', '42', '99', '21', '87', '69'];

      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const number = numbers[Math.floor(Math.random() * numbers.length)];

      const hackerName = `${prefix}${suffix}${number}`;

      typeWriter('Generating hacker alias...', () => {
        setTimeout(() => {
          setHistory((prev) => [...prev, { type: 'output', content: `🎭 Your new hacker name: ${hackerName}` }]);
          setHistory((prev) => [...prev, { type: 'output', content: "Don't forget to wear a black hoodie and type dramatically!" }]);
        }, 1000);
      });
      return;
    }

    if (trimmedCmd === 'music') {
      typeWriter('🎵 Tuning into Synthwave FM...', () => {
        setTimeout(() => {
          setHistory((prev) => [...prev, { type: 'output', content: '♪ Now Playing: "Neon Dreams" by Cyber Artist' }]);
          setHistory((prev) => [...prev, { type: 'output', content: '🎧 Volume: ████████░░ 80%' }]);
          setHistory((prev) => [...prev, { type: 'output', content: '💡 Tip: Replace stream URL in code for your preferred station' }]);
          setHistory((prev) => [...prev, { type: 'output', content: '🔊 [Music player would be embedded here in production]' }]);
        }, 1000);
      });
      return;
    }

    if (trimmedCmd === 'mirror') {
      const output = [
        '🪞 Running diagnostics...',
        'Analyzing operator posture... 95% hacker confidence detected.',
        'Assessing caffeine levels... 73% (optimal for late-night ops).',
        'Reminder: Step away from the keyboard once in a while.'
      ];
      output.forEach((line) => {
        setHistory((prev) => [...prev, { type: 'output', content: line }]);
      });
      return;
    }

    if (trimmedCmd === 'vault') {
      typeWriter('Access denied. Vault requires biometric authentication.', () => {
        setHistory((prev) => [...prev, { type: 'output', content: 'Hint: Complete more missions to unlock vault access.' }]);
      });
      return;
    }

    if (trimmedCmd.startsWith('decrypt ')) {
      const file = trimmedCmd.substring(8).trim();
      typeWriter(`Decrypting ${file}...`, () => {
        setTimeout(() => {
          setHistory((prev) => [...prev, { type: 'output', content: `${file} decrypted successfully. Contents classified.` }]);
        }, 1000);
      });
      return;
    }

    setHistory((prev) => [
      ...prev,
      {
        type: 'error',
        content: `Command not found: ${cmd}. Type 'help' for available commands.`
      }
    ]);
  };

  const generateMatrixRain = () => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    let matrix = '';
    for (let i = 0; i < 20; i++) {
      let line = '';
      for (let j = 0; j < 60; j++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      matrix += `${line}\n`;
    }
    return matrix;
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
    <div className="h-full bg-black text-green-400 font-mono text-sm flex flex-col min-h-0">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-green-500/30 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span id="terminal-window-title" className="text-gray-400 text-xs sm:text-sm truncate mx-2">
          fenrir@nebulahost:{currentDir.replace('/home/fenrir', '~')}
        </span>
        <span className="text-blue-400 text-xs flex-shrink-0">{formatTime(currentTime)}</span>
      </div>

      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0 scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-gray-800/50"
        onClick={() => inputRef.current?.focus()}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label="Historique du terminal"
      >
        {history.map((entry, index) => (
          <div
            key={index}
            className={`${entry.type === 'command' ? 'text-blue-400' : ''} ${entry.type === 'error' ? 'text-red-400' : ''} ${entry.type === 'output' || entry.type === 'typing' ? 'text-green-400' : ''}`}
          >
            <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm break-words overflow-wrap-anywhere">{entry.content}</pre>
          </div>
        ))}

        {!isTyping && (
          <div className="flex items-center text-blue-400 sticky bottom-0 bg-black/95 py-1">
            <span className="text-xs sm:text-sm">{getPrompt()}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-transparent text-green-400 ml-1 text-xs sm:text-sm caret-green-400 terminal-input"
              autoComplete="off"
              spellCheck="false"
              placeholder="Type 'help' for available commands..."
              aria-label="Saisissez une commande dans le terminal"
              aria-describedby="terminal-input-hint"
            />
            <span className="animate-pulse text-xs sm:text-sm">|</span>
            <span id="terminal-input-hint" className="sr-only">
              Appuyez sur Entrée pour exécuter la commande. Utilisez les flèches haut et bas pour parcourir l'historique.
            </span>
          </div>
        )}
      </div>

      <AnimatedLogsFeed isVisible={showLogs} onClose={() => setShowLogs(false)} />
    </div>
  );
}
