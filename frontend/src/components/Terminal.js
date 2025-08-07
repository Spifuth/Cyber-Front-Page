import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockData } from '../mock/data';
import AnimatedLogsFeed from './AnimatedLogsFeed';

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
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const { terminalCommands, neofetchData, fileSystem, motdMessages, commandHistory } = mockData;

  // Load filesystem data
  useEffect(() => {
    const loadFilesystem = async () => {
      try {
        const response = await fetch('/data/filesystem.json');
        const data = await response.json();
        setFilesystem(data.filesystem);
      } catch (error) {
        console.error('Error loading filesystem:', error);
      }
    };
    loadFilesystem();
  }, []);

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
      // Basic Navigation
      ['help', 'Show this help message'],
      ['whoami', 'Display current user info'],
      ['pwd', 'Show current directory path'],
      ['ls', 'List directory contents'],
      ['cd <dir>', 'Change directory location'],
      ['cat <file>', 'Display file contents'],
      ['clear', 'Clear terminal screen'],
      ['exit', 'Close terminal session'],
      
      // System Info
      ['neofetch', 'Display system information'],
      ['nmap <host>', 'Network port scanner'],
      ['curl <url>', 'Make HTTP requests'],
      
      // Professional Pages
      ['resume', 'View professional resume'],
      ['timeline', 'Show career timeline'],
      ['stack', 'Display technology stack'],
      ['skills', 'Show skills radar chart'],
      ['infra', 'View infrastructure setup'],
      ['certs', 'List certifications'],
      ['contact', 'Show contact information'],
      ['learning', 'Display learning resources'],
      ['projects', 'Navigate to projects page'],
      
      // Fun & Interactive
      ['logs', 'Toggle live system logs'],
      ['matrix', 'Enter the Matrix'],
      ['banner <text>', 'Generate ASCII art banners'],
      ['hackername', 'Generate hacker alias'],
      ['music', 'Play synthwave radio'],
      ['mirror', 'System analysis with attitude'],
      ['vault', 'Access encrypted vault'],
      ['decrypt <file>', 'Decrypt vault files'],
      ['theme <name>', 'Switch color themes'],
      ['sudo <cmd>', 'Fake elevated privileges'],
      
      // Easter Eggs
      ['cd underground', 'Access the underground'],
      ['krbtgt roasting', 'Launch Kerberos attack'],
      ['selfdestruct', 'Trigger system meltdown']
    ];
    
    let helpText = '╔══════════════════════════════════════════════════════════════╗\n';
    helpText += '║                    NEBULAHOST COMMAND CENTER                 ║\n';
    helpText += '╠══════════════════════════════════════════════════════════════╣\n';
    helpText += '║                                                              ║\n';
    
    // Group commands in pairs for 2-column layout
    for (let i = 0; i < commands.length; i += 2) {
      const [cmd1, desc1] = commands[i];
      const [cmd2, desc2] = commands[i + 1] || ['', ''];
      
      const leftCmd = cmd1.padEnd(20);
      const leftDesc = desc1.padEnd(25);
      const rightCmd = cmd2.padEnd(15);
      const rightDesc = desc2.padEnd(20);
      
      if (cmd2) {
        helpText += `║ ${leftCmd} ${leftDesc.slice(0, 25)} │ ${rightCmd} ${rightDesc.slice(0, 15)} ║\n`;
      } else {
        helpText += `║ ${leftCmd} ${leftDesc.slice(0, 25)}                          ║\n`;
      }
    }
    
    helpText += '║                                                              ║\n';
    helpText += '╠══════════════════════════════════════════════════════════════╣\n';
    helpText += '║  🎯 TIP: Use ↑/↓ arrows for command history                  ║\n';
    helpText += '║  🚀 NEW: matrix, logs, skills, banner <text>                ║\n';
    helpText += '║  🎨 THEMES: theme matrix|neon|cyber|retro                   ║\n';
    helpText += '╚══════════════════════════════════════════════════════════════╝';
    
    setHistory(prev => [...prev, { type: 'output', content: helpText }]);
  };

  // Security: Input sanitization and validation
  const sanitizeInput = (input) => {
    // Remove potentially dangerous characters and limit length
    return input
      .replace(/[<>&"']/g, '') // Remove HTML/XML special chars
      .replace(/\.\./g, '')     // Remove path traversal
      .slice(0, 200)            // Limit input length
      .trim();
  };

  const validateCommand = (cmd) => {
    const allowedCommands = [
      'help', 'whoami', 'pwd', 'ls', 'clear', 'exit', 'neofetch',
      'resume', 'timeline', 'stack', 'skills', 'infra', 'certs', 'email', 'contact',
      'learning', 'resources', 'logs', 'projects', 'hackername', 'music', 'radio',
      'mirror', 'matrix', 'vault', 'selfdestruct', 'krbtgt roasting'
    ];
    
    const allowedPrefixes = ['cd ', 'cat ', 'nmap ', 'curl ', 'sudo ', 'decrypt ', 'banner ', 'theme '];
    
    return allowedCommands.includes(cmd) || 
           allowedPrefixes.some(prefix => cmd.startsWith(prefix));
  };

  const executeCommand = (cmd) => {
    // Security: Sanitize and validate input
    const sanitizedCmd = sanitizeInput(cmd);
    const trimmedCmd = sanitizedCmd.toLowerCase();
    
    // Add command to history (with sanitized input)
    setHistory(prev => [...prev, { type: 'command', content: `${getPrompt()}${sanitizedCmd}` }]);

    if (trimmedCmd === '') return;

    // Security: Validate command is allowed
    if (!validateCommand(trimmedCmd)) {
      setHistory(prev => [...prev, { 
        type: 'error', 
        content: `Command not recognized: ${sanitizedCmd}. Type 'help' for available commands.` 
      }]);
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
      if (target === 'nebulahost.tech' || target === '127.0.0.1' || target) {
        executeNmapScan(target);
      } else {
        setHistory(prev => [...prev, { type: 'error', content: 'nmap: usage: nmap <target>' }]);
      }
      return;
    }

    if (trimmedCmd === 'pwd') {
      setHistory(prev => [...prev, { type: 'output', content: currentDir }]);
      return;
    }

    if (trimmedCmd === 'whoami') {
      setHistory(prev => [...prev, { type: 'output', content: 'fenrir' }]);
      return;
    }

    if (trimmedCmd === 'exit') {
      typeWriter('Connection terminated. Goodbye!', () => {
        setTimeout(() => {
          // Close terminal or navigate away
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
      
      // Handle other directory changes
      if (path === '~' || path === '') {
        setCurrentDir('/home/fenrir');
        setHistory(prev => [...prev, { type: 'output', content: '' }]);
      } else if (path === '..') {
        const parentDir = currentDir.split('/').slice(0, -1).join('/') || '/';
        setCurrentDir(parentDir);
        setHistory(prev => [...prev, { type: 'output', content: '' }]);
      } else {
        const newPath = path.startsWith('/') ? path : currentDir + '/' + path;
        if (filesystem?.directories[newPath]) {
          setCurrentDir(newPath);
          setHistory(prev => [...prev, { type: 'output', content: '' }]);
        } else if (fileSystem[newPath]) {
          // Fallback to old system
          setCurrentDir(newPath);
          setHistory(prev => [...prev, { type: 'output', content: '' }]);
        } else {
          setHistory(prev => [...prev, { type: 'error', content: `cd: ${path}: No such file or directory` }]);
        }
      }
      return;
    }

    if (trimmedCmd === 'ls') {
      let output = '';
      if (filesystem?.directories[currentDir]) {
        // Use new filesystem structure
        const dir = filesystem.directories[currentDir];
        output = dir.contents.join('  ');
      } else if (fileSystem[currentDir]) {
        // Fallback to old system
        output = fileSystem[currentDir].join('  ');
      } else {
        output = 'Directory not found';
      }
      setHistory(prev => [...prev, { type: 'output', content: output }]);
      return;
    }

    if (trimmedCmd.startsWith('cat ')) {
      const filename = trimmedCmd.substring(4).trim();
      const filePath = filename.startsWith('/') ? filename : currentDir + '/' + filename;
      
      // Check new filesystem structure first
      if (filesystem?.files[filePath]) {
        const fileContent = filesystem.files[filePath].content;
        setHistory(prev => [...prev, { type: 'output', content: fileContent }]);
      } else if (terminalCommands[`cat ${filename}`]) {
        // Fallback to old system
        setHistory(prev => [...prev, { type: 'output', content: terminalCommands[`cat ${filename}`] }]);
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

    if (trimmedCmd.startsWith('curl ')) {
      const url = trimmedCmd.substring(5).trim();
      if (url.includes('ittools.nebulahost.tech')) {
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

    // ============ PROFESSIONAL COMMANDS ============
    
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

    if (trimmedCmd === 'email' || trimmedCmd === 'contact') {
      typeWriter('Opening secure communication channels...', () => {
        setTimeout(() => navigate('/contact'), 1000);
      });
      return;
    }

    if (trimmedCmd === 'learning' || trimmedCmd === 'resources') {
      typeWriter('Accessing learning resources database...', () => {
        setTimeout(() => navigate('/learning'), 1000);
      });
      return;
    }

    if (trimmedCmd === 'logs') {
      setShowLogs(!showLogs);
      typeWriter(`Live logs ${showLogs ? 'disabled' : 'enabled'}. System monitoring ${showLogs ? 'paused' : 'active'}.`);
      return;
    }

    if (trimmedCmd === 'projects') {
      typeWriter('Accessing project portfolio...', () => {
        setTimeout(() => {
          // Scroll to projects section instead of navigating
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
          setHistory(prev => [...prev, { type: 'output', content: generateMatrixRain() }]);
          setTimeout(() => setMatrixActive(false), 5000);
        }, 1000);
      });
      return;
    }

    if (trimmedCmd.startsWith('banner ')) {
      const text = trimmedCmd.substring(7).trim();
      if (!text) {
        setHistory(prev => [...prev, { type: 'error', content: 'Usage: banner <text>' }]);
        return;
      }
      
      typeWriter('Generating ASCII art...', () => {
        setTimeout(() => {
          const asciiArt = generateASCIIBanner(text);
          setHistory(prev => [...prev, { type: 'output', content: asciiArt }]);
        }, 1000);
      });
      return;
    }

    if (trimmedCmd.startsWith('theme ')) {
      const themeName = trimmedCmd.substring(6).trim();
      const availableThemes = ['default', 'matrix', 'neon', 'cyber', 'retro'];
      
      if (!themeName) {
        setHistory(prev => [...prev, { type: 'output', content: `Available themes: ${availableThemes.join(', ')}` }]);
        setHistory(prev => [...prev, { type: 'output', content: `Current theme: ${currentTheme}` }]);
        return;
      }
      
      if (!availableThemes.includes(themeName)) {
        setHistory(prev => [...prev, { type: 'error', content: `Unknown theme: ${themeName}. Available: ${availableThemes.join(', ')}` }]);
        return;
      }
      
      setCurrentTheme(themeName);
      applyTheme(themeName);
      typeWriter(`Theme changed to "${themeName}". Terminal aesthetics updated.`);
      return;
    }

    // ============ FUN COMMANDS ============
    
    if (trimmedCmd.startsWith('sudo ')) {
      const sudoCmd = trimmedCmd.substring(5).trim();
      const jokes = [
        `fenrir is not in the sudoers file. This incident will be reported to Santa.`,
        `Sorry ${sudoCmd}, I can't let you do that. *HAL 9000 voice*`,
        `sudo: password incorrect. Try 'password123' or 'admin'. Just kidding! 😂`,
        `Access denied. Maybe try saying "please"? No wait, this isn't Canada.`,
        `${sudoCmd}: command not found. Did you try turning it off and on again?`,
        `Permission denied. Your security clearance is insufficient for this operation.`
      ];
      
      if (sudoCmd === 'rm -rf /' || sudoCmd === 'rm -rf /*') {
        typeWriter('🚨 CRITICAL SYSTEM ERROR 🚨\nDetected attempt to delete everything!\nInitiating emergency protocols...', () => {
          setTimeout(() => {
            setHistory(prev => [...prev, { type: 'error', content: '❌ Just kidding! No system was harmed in the making of this joke.' }]);
            setHistory(prev => [...prev, { type: 'output', content: '💡 Pro tip: Never run "sudo rm -rf /" on a real system!' }]);
          }, 2000);
        });
      } else {
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        setHistory(prev => [...prev, { type: 'error', content: randomJoke }]);
      }
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
      
      typeWriter(`Generating hacker alias...`, () => {
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: `🎭 Your new hacker name: ${hackerName}` }]);
          setHistory(prev => [...prev, { type: 'output', content: `Don't forget to wear a black hoodie and type dramatically!` }]);
        }, 1000);
      });
      return;
    }

    if (trimmedCmd === 'music' || trimmedCmd === 'radio') {
      typeWriter('🎵 Tuning into Synthwave FM...', () => {
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: '♪ Now Playing: "Neon Dreams" by Cyber Artist' }]);
          setHistory(prev => [...prev, { type: 'output', content: '🎧 Volume: ████████░░ 80%' }]);
          setHistory(prev => [...prev, { type: 'output', content: '💡 Tip: Replace stream URL in code for your preferred station' }]);
          // In a real implementation, you would embed an audio player here
          setHistory(prev => [...prev, { type: 'output', content: '🔊 [Music player would be embedded here in production]' }]);
        }, 1500);
      });
      return;
    }

    if (trimmedCmd === 'mirror') {
      const userAgent = navigator.userAgent;
      let browserInfo = 'Unknown Browser';
      let sarcasm = '';
      
      if (userAgent.includes('Chrome')) {
        browserInfo = 'Google Chrome (The Data Collector™)';
        sarcasm = 'Ah, a Chrome user. Google already knows what you had for breakfast.';
      } else if (userAgent.includes('Firefox')) {
        browserInfo = 'Mozilla Firefox (The Privacy Advocate)';
        sarcasm = 'Firefox user detected. You probably use DuckDuckGo too. Respect!';
      } else if (userAgent.includes('Safari')) {
        browserInfo = 'Apple Safari (The Walled Garden)';
        sarcasm = 'Safari user? Let me guess, you also have an iPhone, iPad, and MacBook.';
      } else if (userAgent.includes('Edge')) {
        browserInfo = 'Microsoft Edge (The Underdog)';
        sarcasm = 'Edge? Brave choice! Microsoft thanks you for not using Chrome.';
      }
      
      const platform = navigator.platform;
      const language = navigator.language;
      
      typeWriter('Analyzing your digital reflection...', () => {
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: '🔍 SYSTEM ANALYSIS COMPLETE' }]);
          setHistory(prev => [...prev, { type: 'output', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━━' }]);
          setHistory(prev => [...prev, { type: 'output', content: `Browser: ${browserInfo}` }]);
          setHistory(prev => [...prev, { type: 'output', content: `Platform: ${platform}` }]);
          setHistory(prev => [...prev, { type: 'output', content: `Language: ${language}` }]);
          setHistory(prev => [...prev, { type: 'output', content: `Screen: ${window.screen.width}x${window.screen.height}` }]);
          setHistory(prev => [...prev, { type: 'output', content: '' }]);
          setHistory(prev => [...prev, { type: 'output', content: `💬 ${sarcasm}` }]);
        }, 2000);
      });
      return;
    }

    if (trimmedCmd === 'vault') {
      typeWriter('Accessing encrypted vault... Please stand by...', () => {
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: '🔒 SECURE VAULT ACCESSED' }]);
          setHistory(prev => [...prev, { type: 'output', content: '━━━━━━━━━━━━━━━━━━━━━━━━━━' }]);
          setHistory(prev => [...prev, { type: 'output', content: 'Contents:' }]);
          setHistory(prev => [...prev, { type: 'output', content: '• secret.txt.gpg     [ENCRYPTED]' }]);
          setHistory(prev => [...prev, { type: 'output', content: '• passwords.kdb      [ENCRYPTED]' }]);
          setHistory(prev => [...prev, { type: 'output', content: '• nuclear_codes.zip  [ENCRYPTED]' }]);
          setHistory(prev => [...prev, { type: 'output', content: '• my_diary.txt.enc   [ENCRYPTED]' }]);
          setHistory(prev => [...prev, { type: 'output', content: '' }]);
          setHistory(prev => [...prev, { type: 'output', content: '💡 Use "decrypt <filename>" to attempt decryption' }]);
        }, 2000);
      });
      return;
    }

    if (trimmedCmd.startsWith('decrypt ')) {
      const filename = trimmedCmd.substring(8).trim();
      const validFiles = ['secret.txt.gpg', 'passwords.kdb', 'nuclear_codes.zip', 'my_diary.txt.enc'];
      
      if (!validFiles.includes(filename)) {
        setHistory(prev => [...prev, { type: 'error', content: `File not found: ${filename}` }]);
        return;
      }
      
      typeWriter(`Attempting to decrypt ${filename}...`, () => {
        setTimeout(() => {
          if (filename === 'secret.txt.gpg') {
            setHistory(prev => [...prev, { type: 'output', content: '🔓 DECRYPTION SUCCESSFUL!' }]);
            setHistory(prev => [...prev, { type: 'output', content: '' }]);
            setHistory(prev => [...prev, { type: 'output', content: 'The secret to happiness is:' }]);
            setHistory(prev => [...prev, { type: 'output', content: 'Good friends, good coffee, and good cybersecurity! ☕' }]);
          } else if (filename === 'nuclear_codes.zip') {
            setHistory(prev => [...prev, { type: 'error', content: '❌ DECRYPTION FAILED' }]);
            setHistory(prev => [...prev, { type: 'output', content: 'Error: Nice try, but these are fake nuclear codes!' }]);
            setHistory(prev => [...prev, { type: 'output', content: 'Real code is: 00000000 (it was changed from 12345678)' }]);
          } else if (filename === 'my_diary.txt.enc') {
            setHistory(prev => [...prev, { type: 'output', content: '🔓 DECRYPTION SUCCESSFUL!' }]);
            setHistory(prev => [...prev, { type: 'output', content: '' }]);
            setHistory(prev => [...prev, { type: 'output', content: 'Dear Diary,' }]);
            setHistory(prev => [...prev, { type: 'output', content: 'Today I successfully prevented 47 cyber attacks.' }]);
            setHistory(prev => [...prev, { type: 'output', content: 'Also, I think pineapple on pizza is acceptable. 🍕' }]);
            setHistory(prev => [...prev, { type: 'output', content: 'Tomorrow: Learn quantum cryptography.' }]);
          } else {
            setHistory(prev => [...prev, { type: 'error', content: '❌ DECRYPTION FAILED' }]);
            setHistory(prev => [...prev, { type: 'output', content: 'Encryption too strong. Maybe try password "password"? 😏' }]);
          }
        }, 3000);
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

  // Helper function to generate Matrix rain effect
  const generateMatrixRain = () => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    let matrix = '';
    for (let i = 0; i < 20; i++) {
      let line = '';
      for (let j = 0; j < 60; j++) {
        line += chars[Math.floor(Math.random() * chars.length)];
      }
      matrix += line + '\n';
    }
    return matrix;
  };

  // Helper function to generate ASCII banner
  const generateASCIIBanner = (text) => {
    const lines = [
      '╔══════════════════════════════════════════════════════════════╗',
      '║                                                              ║',
      `║  ${text.toUpperCase().padStart(30 + text.length / 2).padEnd(60)}  ║`,
      '║                                                              ║',
      '╚══════════════════════════════════════════════════════════════╝'
    ];
    return lines.join('\n');
  };

  // Helper function to apply theme
  const applyTheme = (themeName) => {
    // This would typically modify CSS variables or classes
    // For now, just store the theme name
    localStorage.setItem('terminal-theme', themeName);
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
      {/* Terminal Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-green-500/30 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-gray-400 text-xs sm:text-sm truncate mx-2">
          fenrir@nebulahost:{currentDir.replace('/home/fenrir', '~')}
        </span>
        <span className="text-blue-400 text-xs flex-shrink-0">{formatTime(currentTime)}</span>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0 scrollbar-thin scrollbar-thumb-green-500/50 scrollbar-track-gray-800/50"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((entry, index) => (
          <div key={index} className={`
            ${entry.type === 'command' ? 'text-blue-400' : ''}
            ${entry.type === 'error' ? 'text-red-400' : ''}
            ${entry.type === 'output' ? 'text-green-400' : ''}
            ${entry.type === 'typing' ? 'text-green-400' : ''}
          `}>
            <pre className="whitespace-pre-wrap font-mono text-xs sm:text-sm break-words overflow-wrap-anywhere">{entry.content}</pre>
          </div>
        ))}

        {/* Current Input */}
        {!isTyping && (
          <div className="flex items-center text-blue-400 sticky bottom-0 bg-black/95 py-1">
            <span className="text-xs sm:text-sm">{getPrompt()}</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 bg-transparent text-green-400 ml-1 text-xs sm:text-sm caret-green-400"
              style={{ 
                outline: 'none', 
                border: 'none', 
                boxShadow: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield'
              }}
              autoComplete="off"
              spellCheck="false"
              placeholder="Type 'help' for available commands..."
            />
            <span className="animate-pulse text-xs sm:text-sm">|</span>
          </div>
        )}
      </div>
      
      {/* Animated Logs Feed */}
      <AnimatedLogsFeed 
        isVisible={showLogs}
        onClose={() => setShowLogs(false)}
      />
    </div>
  );
}