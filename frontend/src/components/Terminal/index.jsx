import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMockTerminal } from '../../mocks/mockBackend';
import AnimatedLogsFeed from '../AnimatedLogsFeed';
import { getExternalUrl, isMockEnabled } from '../../lib/env';
import { loadCollection } from '../../lib/dataClient';
import { TerminalHeader, TerminalHistory, TerminalInput } from './TerminalUI';

/**
 * useTerminalState - Custom hook for managing terminal state
 */
function useTerminalState() {
  const [history, setHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentDir, setCurrentDir] = useState('/home/fenrir');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [filesystem, setFilesystem] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);

  return {
    history, setHistory,
    currentCommand, setCurrentCommand,
    isTyping, setIsTyping,
    currentTime, setCurrentTime,
    currentDir, setCurrentDir,
    historyIndex, setHistoryIndex,
    filesystem, setFilesystem,
    showLogs, setShowLogs,
    matrixActive, setMatrixActive,
    isTabHidden, setIsTabHidden
  };
}

/**
 * useTerminalEffects - Side effects for the terminal
 */
function useTerminalEffects({
  setFilesystem,
  setCurrentTime,
  setHistory,
  setIsTabHidden,
  isTabHidden,
  motdMessages,
  inputRef,
  terminalRef,
  history
}) {
  const isTabHiddenRef = useRef(false);
  const mockMode = isMockEnabled();

  // Load filesystem
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
  }, [mockMode, setFilesystem]);

  // Visibility change handler
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      const hidden = document.visibilityState === 'hidden';
      isTabHiddenRef.current = hidden;
      setIsTabHidden(hidden);
    };

    handleVisibilityChange();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [setIsTabHidden]);

  // Clock timer
  useEffect(() => {
    if (isTabHidden) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isTabHidden, setCurrentTime]);

  // Initial MOTD
  useEffect(() => {
    const randomMotd = motdMessages[Math.floor(Math.random() * motdMessages.length)];
    setHistory([
      { type: 'output', content: 'NebulaHost Terminal v2.1.0' },
      { type: 'output', content: `Today's wisdom: "${randomMotd}"` },
      { type: 'output', content: 'Type "help" for available commands.' },
      { type: 'output', content: '' }
    ]);
  }, [motdMessages, setHistory]);

  // Auto-focus input
  useEffect(() => {
    inputRef.current?.focus();
  });

  // Auto-scroll
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, terminalRef]);

  return { isTabHiddenRef };
}

/**
 * Terminal - Interactive terminal emulator component
 */
export default function Terminal({
  onNavigateToUnderground,
  onNavigateToKrbtgt,
  onNavigateToSelfDestruct
}) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const typingIntervalRef = useRef(null);

  // State
  const state = useTerminalState();
  const {
    history, setHistory,
    currentCommand, setCurrentCommand,
    isTyping, setIsTyping,
    currentTime,
    currentDir,
    historyIndex, setHistoryIndex,
    filesystem,
    showLogs, setShowLogs,
    setMatrixActive,
    isTabHidden
  } = state;

  // Terminal data
  const terminalData = useMemo(() => getMockTerminal(), []);
  const { terminalCommands, neofetchData, fileSystem, motdMessages, commandHistory } = terminalData;
  const toolsLaunchUrl = useMemo(() => getExternalUrl('VITE_TOOLS_URL', '#'), []);

  // Effects
  const { isTabHiddenRef } = useTerminalEffects({
    setFilesystem: state.setFilesystem,
    setCurrentTime: state.setCurrentTime,
    setHistory,
    setIsTabHidden: state.setIsTabHidden,
    isTabHidden,
    motdMessages,
    inputRef,
    terminalRef,
    history
  });

  // Cleanup typing interval
  useEffect(() => () => {
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }
  }, []);

  // Format time
  const formatTime = useCallback((date) => date.toTimeString().slice(0, 8), []);

  // Get prompt string
  const getPrompt = useCallback(() => {
    const time = formatTime(currentTime);
    const shortDir = currentDir.replace('/home/fenrir', '~');
    return `fenrir@nebula:${shortDir} [${time}]$ `;
  }, [currentDir, currentTime, formatTime]);

  // Typewriter effect
  const typeWriter = useCallback((text, callback, speed = 15) => {
    setIsTyping(true);
    let i = 0;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      if (isTabHiddenRef.current) return;

      if (i < text.length) {
        setHistory(prev => {
          const newHistory = [...prev];
          const lastEntry = newHistory[newHistory.length - 1];
          if (lastEntry?.type === 'typing') {
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
  }, [isTabHiddenRef, setHistory, setIsTyping]);

  // Generate matrix rain
  const generateMatrixRain = useCallback(() => {
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
  }, []);

  // Execute command
  const executeCommand = useCallback((cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    setHistory(prev => [...prev, { type: 'command', content: `$ ${cmd}` }]);

    if (!trimmedCmd) return;

    // Clear
    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    // Help
    if (trimmedCmd === 'help') {
      setHistory(prev => [...prev, { type: 'output', content: terminalCommands.help }]);
      return;
    }

    // Simple commands
    const simpleCommands = {
      whoami: terminalCommands.whoami,
      pwd: currentDir,
      date: new Date().toString(),
      uptime: terminalCommands.uptime
    };

    if (simpleCommands[trimmedCmd]) {
      setHistory(prev => [...prev, { type: 'output', content: simpleCommands[trimmedCmd] }]);
      return;
    }

    // Underground
    if (trimmedCmd === 'underground') {
      typeWriter('Accessing restricted area... Initializing secure connection...', () => {
        setTimeout(() => onNavigateToUnderground?.(), 1000);
      });
      return;
    }

    // CD command
    if (trimmedCmd.startsWith('cd ')) {
      const path = trimmedCmd.substring(3).trim();
      const messages = {
        '~': 'Hint: This terminal is focused on commands, not navigation. Try "help" for available commands.',
        '': 'Hint: This terminal is focused on commands, not navigation. Try "help" for available commands.',
        '..': 'Hint: Directory navigation is limited. Use specific commands to access content.'
      };
      const content = messages[path] || `Hint: "${path}" is not accessible. Try "help" to see available commands.`;
      setHistory(prev => [...prev, { type: 'output', content }]);
      return;
    }

    // LS command
    if (trimmedCmd === 'ls') {
      let output = 'Directory not found';
      if (filesystem?.directories?.[currentDir]) {
        const dir = filesystem.directories[currentDir];
        const filesOnly = (dir.contents || []).filter(item => {
          const potentialPath = currentDir.endsWith('/') ? currentDir + item : `${currentDir}/${item}`;
          return !filesystem.directories[potentialPath];
        });
        output = filesOnly.length > 0 ? filesOnly.join('  ') : 'No files found';
      } else if (fileSystem[currentDir]) {
        const filesOnly = fileSystem[currentDir].filter(item => !item.endsWith('/'));
        output = filesOnly.length > 0 ? filesOnly.join('  ') : 'No files found';
      }
      setHistory(prev => [...prev, { type: 'output', content: output }]);
      return;
    }

    // CAT command
    if (trimmedCmd.startsWith('cat ')) {
      const filename = trimmedCmd.substring(4).trim();
      const filePath = filename.startsWith('/') ? filename : `${currentDir}/${filename}`;

      if (filesystem?.files?.[filePath]) {
        setHistory(prev => [...prev, { type: 'output', content: filesystem.files[filePath].content }]);
      } else if (terminalCommands[`cat ${filename}`]) {
        setHistory(prev => [...prev, { type: 'output', content: terminalCommands[`cat ${filename}`] }]);
      } else {
        setHistory(prev => [...prev, { type: 'error', content: `cat: ${filename}: No such file or directory` }]);
      }
      return;
    }

    // Neofetch
    if (trimmedCmd === 'neofetch') {
      const output = `
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
      typeWriter(output);
      return;
    }

    // Special commands
    if (trimmedCmd === 'krbtgt roasting') {
      typeWriter('Initializing Kerberoasting attack... Redirecting to secure terminal...', () => {
        setTimeout(() => onNavigateToKrbtgt?.(), 1000);
      });
      return;
    }

    if (trimmedCmd === 'selfdestruct') {
      typeWriter('WARNING: Initiating self-destruct sequence... Are you sure about this?', () => {
        setTimeout(() => onNavigateToSelfDestruct?.(), 1000);
      });
      return;
    }

    // Navigation commands
    const navCommands = {
      resume: { msg: 'Loading professional resume...', path: '/resume' },
      timeline: { msg: 'Accessing career timeline...', path: '/timeline' },
      stack: { msg: 'Displaying technology stack...', path: '/stack' },
      infra: { msg: 'Loading infrastructure diagram...', path: '/infra' },
      certs: { msg: 'Retrieving certification records...', path: '/certs' },
      contact: { msg: 'Opening secure communication channels...', path: '/contact' },
      learning: { msg: 'Accessing learning resources database...', path: '/learning' },
      skills: { msg: 'Accessing skills matrix... Analyzing competency levels...', path: '/skills' }
    };

    if (navCommands[trimmedCmd]) {
      const { msg, path } = navCommands[trimmedCmd];
      typeWriter(msg, () => setTimeout(() => navigate(path), 1000));
      return;
    }

    // Logs toggle
    if (trimmedCmd === 'logs') {
      const nextState = !showLogs;
      setShowLogs(nextState);
      typeWriter(`Live logs ${nextState ? 'enabled' : 'disabled'}. System monitoring ${nextState ? 'active' : 'paused'}.`);
      return;
    }

    // Projects
    if (trimmedCmd === 'projects') {
      typeWriter('Accessing project portfolio...', () => {
        setTimeout(() => {
          const projectsSection = document.getElementById('projects');
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
            setHistory(prev => [...prev, { type: 'output', content: 'Scrolled to projects section.' }]);
          } else {
            setHistory(prev => [...prev, { type: 'output', content: 'Projects section found. Check the main page.' }]);
          }
        }, 1000);
      });
      return;
    }

    // Matrix
    if (trimmedCmd === 'matrix') {
      typeWriter('Entering the Matrix...', () => {
        setMatrixActive(true);
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: generateMatrixRain() }]);
          setTimeout(() => setMatrixActive(false), 5000);
        }, 1000);
      });
      return;
    }

    // Hackername
    if (trimmedCmd === 'hackername') {
      const prefixes = ['Cyber', 'Dark', 'Neo', 'Zero', 'Phantom', 'Ghost', 'Shadow', 'Digital'];
      const suffixes = ['Wolf', 'Hawk', 'Fox', 'Viper', 'Reaper', 'Hunter', 'Blade', 'Storm'];
      const numbers = ['01', '13', '42', '99', '21', '87', '69'];
      const name = `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}${numbers[Math.floor(Math.random() * numbers.length)]}`;

      typeWriter('Generating hacker alias...', () => {
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: `🎭 Your new hacker name: ${name}` }]);
          setHistory(prev => [...prev, { type: 'output', content: "Don't forget to wear a black hoodie and type dramatically!" }]);
        }, 1000);
      });
      return;
    }

    // Curl
    if (trimmedCmd.startsWith('curl ')) {
      const url = trimmedCmd.substring(5).trim();
      if (url.includes('ittools') || url.includes('tools')) {
        typeWriter('Connecting to IT Tools Suite...', () => {
          setTimeout(() => {
            setHistory(prev => [...prev, { type: 'output', content: '> Response: 200 OK' }]);
            setHistory(prev => [...prev, { type: 'output', content: '> Redirecting...' }]);
            if (toolsLaunchUrl !== '#') {
              setTimeout(() => window.open(toolsLaunchUrl, '_blank'), 1500);
            }
          }, 1000);
        });
      } else {
        typeWriter(`Connecting to ${url}...`, () => {
          setTimeout(() => {
            setHistory(prev => [...prev, { type: 'output', content: '> Response: 200 OK' }]);
          }, 500);
        });
      }
      return;
    }

    // Music, mirror, vault, decrypt
    if (trimmedCmd === 'music') {
      typeWriter('🎵 Tuning into Synthwave FM...', () => {
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: '♪ Now Playing: "Neon Dreams" by Cyber Artist' }]);
          setHistory(prev => [...prev, { type: 'output', content: '🎧 Volume: ████████░░ 80%' }]);
        }, 1000);
      });
      return;
    }

    if (trimmedCmd === 'mirror') {
      ['🪞 Running diagnostics...', 'Analyzing operator posture... 95% hacker confidence detected.', 'Assessing caffeine levels... 73% (optimal for late-night ops).'].forEach(line => {
        setHistory(prev => [...prev, { type: 'output', content: line }]);
      });
      return;
    }

    if (trimmedCmd === 'vault') {
      typeWriter('Access denied. Vault requires biometric authentication.', () => {
        setHistory(prev => [...prev, { type: 'output', content: 'Hint: Complete more missions to unlock vault access.' }]);
      });
      return;
    }

    if (trimmedCmd.startsWith('decrypt ')) {
      const file = trimmedCmd.substring(8).trim();
      typeWriter(`Decrypting ${file}...`, () => {
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: `${file} decrypted successfully. Contents classified.` }]);
        }, 1000);
      });
      return;
    }

    // Command not found
    setHistory(prev => [...prev, { type: 'error', content: `Command not found: ${cmd}. Type 'help' for available commands.` }]);
  }, [
    currentDir, filesystem, fileSystem, generateMatrixRain, navigate,
    neofetchData, onNavigateToKrbtgt, onNavigateToSelfDestruct,
    onNavigateToUnderground, setHistory, setMatrixActive, setShowLogs,
    showLogs, terminalCommands, toolsLaunchUrl, typeWriter
  ]);

  // Handle keyboard input
  const handleKeyPress = useCallback((e) => {
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
  }, [commandHistory, currentCommand, executeCommand, historyIndex, isTyping, setCurrentCommand, setHistoryIndex]);

  return (
    <div className="h-full bg-black text-green-400 font-mono text-sm flex flex-col min-h-0">
      <TerminalHeader currentDir={currentDir} currentTime={currentTime} />

      <TerminalHistory
        history={history}
        terminalRef={terminalRef}
        onFocusInput={() => inputRef.current?.focus()}
      />

      <div className="p-4 pt-0">
        <TerminalInput
          currentCommand={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyPress}
          inputRef={inputRef}
          prompt={getPrompt()}
          isTyping={isTyping}
        />
      </div>

      <AnimatedLogsFeed isVisible={showLogs} onClose={() => setShowLogs(false)} />
    </div>
  );
}
