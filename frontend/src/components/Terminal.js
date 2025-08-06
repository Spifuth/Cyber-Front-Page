import React, { useState, useEffect, useRef } from 'react';
import { mockData } from '../mock/data';

export default function Terminal({ onNavigateToUnderground, onNavigateToKrbtgt }) {
  const [history, setHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const { terminalCommands, neofetchData } = mockData;

  useEffect(() => {
    // Welcome message
    setHistory([
      { type: 'output', content: 'NebulaHost Terminal v2.1.0' },
      { type: 'output', content: 'Type "help" for available commands.' },
      { type: 'output', content: '' }
    ]);
  }, []);

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

  const typeWriter = (text, callback) => {
    setIsTyping(true);
    let i = 0;
    const speed = 30;
    
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

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    // Add command to history
    setHistory(prev => [...prev, { type: 'command', content: `fenrir@nebulahost:~$ ${cmd}` }]);

    if (trimmedCmd === '') return;

    if (trimmedCmd === 'clear') {
      setHistory([]);
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

    if (trimmedCmd === 'cd underground') {
      typeWriter('Access granted. Redirecting to secure zone...', () => {
        setTimeout(() => {
          if (onNavigateToUnderground) {
            onNavigateToUnderground();
          }
        }, 1000);
      });
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

    if (trimmedCmd === 'curl ittools.nebulaost.tech') {
      typeWriter('Connecting to IT Tools Suite...', () => {
        setTimeout(() => {
          setHistory(prev => [...prev, { type: 'output', content: '> Response: 200 OK' }]);
          setHistory(prev => [...prev, { type: 'output', content: '> Content-Type: application/json' }]);
          setHistory(prev => [...prev, { type: 'output', content: '> Redirecting...' }]);
          setTimeout(() => {
            window.open('https://ittools.nebulaost.tech', '_blank');
          }, 1500);
        }, 1000);
      });
      return;
    }

    if (trimmedCmd === 'ls') {
      const output = terminalCommands.ls.join('  ');
      setHistory(prev => [...prev, { type: 'output', content: output }]);
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
        typeWriter(output);
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
        <span className="text-gray-400">fenrir@nebulahost:~</span>
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
            <span>fenrir@nebulahost:~$ </span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyPress={handleKeyPress}
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