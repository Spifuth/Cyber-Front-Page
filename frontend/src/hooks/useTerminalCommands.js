import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { TERMINAL_COMMANDS, NEOFETCH_DATA } from '../lib/constants';

/**
 * useTerminalCommands - Custom hook for terminal command execution
 * 
 * @param {Object} options - Configuration options
 * @param {Function} options.setHistory - State setter for terminal history
 * @param {Function} options.typeWriter - Typewriter function for animated output
 * @param {Object} options.filesystem - Filesystem data from backend
 * @param {string} options.currentDir - Current working directory
 * @param {Function} options.setCurrentDir - Setter for current directory
 * @param {Function} options.setShowLogs - Setter for logs visibility
 * @param {boolean} options.showLogs - Current logs visibility state
 * @param {Function} options.setMatrixActive - Setter for matrix animation
 * @param {Object} options.callbacks - Navigation callbacks
 */
export function useTerminalCommands({
  setHistory,
  typeWriter,
  filesystem,
  currentDir,
  setCurrentDir,
  setShowLogs,
  showLogs,
  setMatrixActive,
  callbacks = {}
}) {
  const navigate = useNavigate();
  const { onNavigateToUnderground, onNavigateToKrbtgt, onNavigateToSelfDestruct, toolsLaunchUrl } = callbacks;

  // Navigation commands mapping
  const navigationCommands = {
    resume: { message: 'Loading professional resume...', path: '/resume' },
    timeline: { message: 'Accessing career timeline...', path: '/timeline' },
    stack: { message: 'Displaying technology stack...', path: '/stack' },
    infra: { message: 'Loading infrastructure diagram...', path: '/infra' },
    certs: { message: 'Retrieving certification records...', path: '/certs' },
    contact: { message: 'Opening secure communication channels...', path: '/contact' },
    learning: { message: 'Accessing learning resources database...', path: '/learning' },
    skills: { message: 'Accessing skills matrix... Analyzing competency levels...', path: '/skills' }
  };

  // Generate neofetch output
  const generateNeofetchOutput = useCallback(() => {
    const data = NEOFETCH_DATA;
    return `
                   _,met$$$$$gg.          fenrir@nebulahost
                ,g$$$$$$$$$$$$$$$P.       -----------------
              ,g$$P"     """Y$$.".        OS: ${data.os}
             ,$$P'              \`$$$.     Host: ${data.host}
            ',$$P       ,ggs.     \`$$b:   Kernel: ${data.kernel}
            \`d$$'     ,$P"'   .    $$$    Uptime: ${data.uptime}
             $$P      d$'     ,    $$P    Packages: ${data.packages}
             $$:      $$.   -    ,d$$'    Shell: ${data.shell}
             $$;      Y$b._   _,d$P'      Terminal: ${data.terminal}
             Y$$.    \`.\`"Y$$$$P"'         CPU: ${data.cpu}
             \`$$b      "-.__              GPU: ${data.gpu}
              \`Y$$                       Memory: ${data.memory}
               \`Y$$.                     Disk: ${data.disk}
                 \`$$b.                   Local IP: ${data.localip}
                   \`Y$$b.                Public IP: ${data.publicip}
                     \`"Y$b._             Locale: ${data.locale}
                         \`"""
`;
  }, []);

  // Generate matrix rain effect
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

  // Generate random hacker name
  const generateHackerName = useCallback(() => {
    const prefixes = ['Cyber', 'Dark', 'Neo', 'Zero', 'Phantom', 'Ghost', 'Shadow', 'Digital'];
    const suffixes = ['Wolf', 'Hawk', 'Fox', 'Viper', 'Reaper', 'Hunter', 'Blade', 'Storm'];
    const numbers = ['01', '13', '42', '99', '21', '87', '69'];

    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const number = numbers[Math.floor(Math.random() * numbers.length)];

    return `${prefix}${suffix}${number}`;
  }, []);

  // Execute command
  const executeCommand = useCallback((cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();

    // Add command to history
    setHistory(prev => [...prev, { type: 'command', content: `$ ${cmd}` }]);

    // Empty command
    if (!trimmedCmd) return;

    // Clear command
    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    // Help command
    if (trimmedCmd === 'help') {
      setHistory(prev => [...prev, { type: 'output', content: TERMINAL_COMMANDS.help }]);
      return;
    }

    // Whoami command
    if (trimmedCmd === 'whoami') {
      setHistory(prev => [...prev, { type: 'output', content: TERMINAL_COMMANDS.whoami }]);
      return;
    }

    // PWD command
    if (trimmedCmd === 'pwd') {
      setHistory(prev => [...prev, { type: 'output', content: currentDir }]);
      return;
    }

    // Date command
    if (trimmedCmd === 'date') {
      setHistory(prev => [...prev, { type: 'output', content: new Date().toString() }]);
      return;
    }

    // Uptime command
    if (trimmedCmd === 'uptime') {
      setHistory(prev => [...prev, { type: 'output', content: TERMINAL_COMMANDS.uptime }]);
      return;
    }

    // Underground command
    if (trimmedCmd === 'underground') {
      typeWriter('Accessing restricted area... Initializing secure connection...', () => {
        setTimeout(() => {
          if (onNavigateToUnderground) onNavigateToUnderground();
        }, 1000);
      });
      return;
    }

    // CD command
    if (trimmedCmd.startsWith('cd ')) {
      const path = trimmedCmd.substring(3).trim();
      
      if (path === '~' || path === '') {
        setHistory(prev => [...prev, { 
          type: 'output', 
          content: 'Hint: This terminal is focused on commands, not navigation. Try "help" for available commands.' 
        }]);
      } else if (path === '..') {
        setHistory(prev => [...prev, { 
          type: 'output', 
          content: 'Hint: Directory navigation is limited. Use specific commands to access content.' 
        }]);
      } else {
        setHistory(prev => [...prev, { 
          type: 'output', 
          content: `Hint: "${path}" is not accessible. Try "help" to see available commands.` 
        }]);
      }
      return;
    }

    // LS command
    if (trimmedCmd === 'ls') {
      let output = '';
      if (filesystem?.directories?.[currentDir]) {
        const dir = filesystem.directories[currentDir];
        const filesOnly = (dir.contents || []).filter(item => {
          const potentialPath = currentDir.endsWith('/') ? currentDir + item : `${currentDir}/${item}`;
          return !filesystem.directories[potentialPath];
        });
        output = filesOnly.length > 0 ? filesOnly.join('  ') : 'No files found';
      } else {
        output = 'Directory not found';
      }
      setHistory(prev => [...prev, { type: 'output', content: output }]);
      return;
    }

    // CAT command
    if (trimmedCmd.startsWith('cat ')) {
      const filename = trimmedCmd.substring(4).trim();
      const filePath = filename.startsWith('/') ? filename : `${currentDir}/${filename}`;

      if (filesystem?.files?.[filePath]) {
        const fileContent = filesystem.files[filePath].content;
        setHistory(prev => [...prev, { type: 'output', content: fileContent }]);
      } else {
        setHistory(prev => [...prev, { type: 'error', content: `cat: ${filename}: No such file or directory` }]);
      }
      return;
    }

    // Neofetch command
    if (trimmedCmd === 'neofetch') {
      typeWriter(generateNeofetchOutput());
      return;
    }

    // Krbtgt roasting command
    if (trimmedCmd === 'krbtgt roasting') {
      typeWriter('Initializing Kerberoasting attack... Redirecting to secure terminal...', () => {
        setTimeout(() => {
          if (onNavigateToKrbtgt) onNavigateToKrbtgt();
        }, 1000);
      });
      return;
    }

    // Self-destruct command
    if (trimmedCmd === 'selfdestruct') {
      typeWriter('WARNING: Initiating self-destruct sequence... Are you sure about this?', () => {
        setTimeout(() => {
          if (onNavigateToSelfDestruct) onNavigateToSelfDestruct();
        }, 1000);
      });
      return;
    }

    // Curl command
    if (trimmedCmd.startsWith('curl ')) {
      const url = trimmedCmd.substring(5).trim();
      if (url.includes('ittools') || url.includes('tools')) {
        typeWriter('Connecting to IT Tools Suite...', () => {
          setTimeout(() => {
            setHistory(prev => [...prev, { type: 'output', content: '> Response: 200 OK' }]);
            setHistory(prev => [...prev, { type: 'output', content: '> Content-Type: application/json' }]);
            setHistory(prev => [...prev, { type: 'output', content: '> Redirecting...' }]);
            if (toolsLaunchUrl && toolsLaunchUrl !== '#') {
              setTimeout(() => {
                window.open(toolsLaunchUrl, '_blank');
              }, 1500);
            }
          }, 1000);
        });
      } else {
        typeWriter(`Connecting to ${url}...`, () => {
          setTimeout(() => {
            setHistory(prev => [...prev, { type: 'output', content: '> Response: 200 OK' }]);
            setHistory(prev => [...prev, { type: 'output', content: '> Connection successful' }]);
          }, 500);
        });
      }
      return;
    }

    // Navigation commands
    if (navigationCommands[trimmedCmd]) {
      const { message, path } = navigationCommands[trimmedCmd];
      typeWriter(message, () => {
        setTimeout(() => navigate(path), 1000);
      });
      return;
    }

    // Logs command
    if (trimmedCmd === 'logs') {
      const nextState = !showLogs;
      setShowLogs(nextState);
      typeWriter(`Live logs ${nextState ? 'enabled' : 'disabled'}. System monitoring ${nextState ? 'active' : 'paused'}.`);
      return;
    }

    // Projects command
    if (trimmedCmd === 'projects') {
      typeWriter('Accessing project portfolio...', () => {
        setTimeout(() => {
          const projectsSection = document.getElementById('projects');
          if (projectsSection) {
            projectsSection.scrollIntoView({ behavior: 'smooth' });
            setHistory(prev => [...prev, { type: 'output', content: 'Scrolled to projects section. Use browser to view full portfolio.' }]);
          } else {
            setHistory(prev => [...prev, { type: 'output', content: 'Projects section found. Check the main page for project gallery.' }]);
          }
        }, 1000);
      });
      return;
    }

    // Matrix command
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

    // Hacker name command
    if (trimmedCmd === 'hackername') {
      typeWriter('Generating hacker alias...', () => {
        setTimeout(() => {
          const hackerName = generateHackerName();
          setHistory(prev => [...prev, { type: 'output', content: `🎭 Your new hacker name: ${hackerName}` }]);
          setHistory(prev => [...prev, { type: 'output', content: "Don't forget to wear a black hoodie and type dramatically!" }]);
        }, 1000);
      });
      return;
    }

    // Music command
    if (trimmedCmd === 'music') {
      typeWriter('🎵 Tuning into Synthwave FM...', () => {
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: '♪ Now Playing: "Neon Dreams" by Cyber Artist' }]);
          setHistory(prev => [...prev, { type: 'output', content: '🎧 Volume: ████████░░ 80%' }]);
          setHistory(prev => [...prev, { type: 'output', content: '💡 Tip: Replace stream URL in code for your preferred station' }]);
          setHistory(prev => [...prev, { type: 'output', content: '🔊 [Music player would be embedded here in production]' }]);
        }, 1000);
      });
      return;
    }

    // Mirror command
    if (trimmedCmd === 'mirror') {
      const output = [
        '🪞 Running diagnostics...',
        'Analyzing operator posture... 95% hacker confidence detected.',
        'Assessing caffeine levels... 73% (optimal for late-night ops).',
        'Reminder: Step away from the keyboard once in a while.'
      ];
      output.forEach(line => {
        setHistory(prev => [...prev, { type: 'output', content: line }]);
      });
      return;
    }

    // Vault command
    if (trimmedCmd === 'vault') {
      typeWriter('Access denied. Vault requires biometric authentication.', () => {
        setHistory(prev => [...prev, { type: 'output', content: 'Hint: Complete more missions to unlock vault access.' }]);
      });
      return;
    }

    // Decrypt command
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
    setHistory(prev => [
      ...prev,
      {
        type: 'error',
        content: `Command not found: ${cmd}. Type 'help' for available commands.`
      }
    ]);
  }, [
    currentDir,
    filesystem,
    generateHackerName,
    generateMatrixRain,
    generateNeofetchOutput,
    navigate,
    onNavigateToKrbtgt,
    onNavigateToSelfDestruct,
    onNavigateToUnderground,
    setHistory,
    setMatrixActive,
    setShowLogs,
    showLogs,
    toolsLaunchUrl,
    typeWriter
  ]);

  return { executeCommand };
}

export default useTerminalCommands;
