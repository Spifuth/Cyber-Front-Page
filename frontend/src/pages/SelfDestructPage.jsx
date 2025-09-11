import React, { useState, useEffect } from 'react';
import { ArrowLeft, Skull, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SelfDestructPage() {
  const navigate = useNavigate();
  const [currentLine, setCurrentLine] = useState(0);
  const [showMeltdown, setShowMeltdown] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [allLinesShown, setAllLinesShown] = useState(false);

  const lines = [
    { text: '[!] WARNING: UNAUTHORIZED SYSTEM ACCESS DETECTED', delay: 800, type: 'warning' },
    { text: '[!] Initiating emergency protocols...', delay: 1000, type: 'warning' },
    { text: '[x] ALERT: Multiple roast attempts logged in system', delay: 1200, type: 'error' },
    { text: '[!] System integrity compromised by user incompetence', delay: 1000, type: 'warning' },
    { text: '[x] ERROR: Detected unauthorized Kerberoasting activities', delay: 1500, type: 'error' },
    { text: '', delay: 500, type: 'blank' },
    { text: '[💀] CRITICAL: Activating emergency fallback exploit...', delay: 1000, type: 'critical' },
    { text: '[!] Executing: rm -rf /', delay: 1200, type: 'warning' },
    { text: '[x] Permission denied: User not root 😅', delay: 1500, type: 'error' },
    { text: '[!] Attempting alternative destruction methods...', delay: 1000, type: 'warning' },
    { text: '[x] Error: Cannot delete /etc/passwd - File not found', delay: 1000, type: 'error' },
    { text: '[x] Error: /dev/null is full (how?)', delay: 800, type: 'error' },
    { text: '[x] Error: Kernel panic failed - kernel too stable', delay: 1000, type: 'error' },
    { text: '[!] Warning: Attempting to divide by zero...', delay: 1200, type: 'warning' },
    { text: '[x] Error: Mathematics.exe has stopped working', delay: 1000, type: 'error' },
    { text: '', delay: 800, type: 'blank' },
    { text: '[💥] FALLBACK: Initiating psychological destruction...', delay: 1500, type: 'critical' },
    { text: '[!] Your favorite show has been cancelled', delay: 1000, type: 'warning' },
    { text: '[!] All your passwords are now "password123"', delay: 1000, type: 'warning' },
    { text: '[!] Your browser history has been sent to your mom', delay: 1200, type: 'warning' },
    { text: '[💀] ULTIMATE WEAPON: Rickroll.exe activated', delay: 1500, type: 'critical' }
  ];

  const staticPattern = Array(100).fill('█▓▒░').join('');

  useEffect(() => {
    if (currentLine < lines.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, lines[currentLine]?.delay || 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Start meltdown
      const meltdownTimer = setTimeout(() => {
        setShowMeltdown(true);
        
        setTimeout(() => {
          setShowCountdown(true);
          
          // Countdown timer
          const countdownInterval = setInterval(() => {
            setCountdown(prev => {
              if (prev <= 1) {
                clearInterval(countdownInterval);
                setTimeout(() => {
                  setAllLinesShown(true);
                }, 1000);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }, 2000);
      }, 1000);
      
      return () => clearTimeout(meltdownTimer);
    }
  }, [currentLine, lines]);

  const getLineColor = (type) => {
    switch (type) {
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'critical': return 'text-red-500 animate-pulse font-bold';
      case 'blank': return 'text-transparent';
      default: return 'text-green-400';
    }
  };

  const getLineIcon = (type) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 inline mr-2" />;
      case 'critical': return <Skull className="w-4 h-4 inline mr-2 animate-bounce" />;
      case 'warning': return <Zap className="w-4 h-4 inline mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Chaotic background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-orange-900/20"></div>
        
        {/* Intense glitch effects when meltdown starts */}
        {showMeltdown && (
          <div className="absolute inset-0">
            {/* Random static overlay */}
            <div className="absolute inset-0 opacity-10 text-red-500 text-xs leading-none overflow-hidden animate-pulse">
              {Array(30).fill(staticPattern).join('')}
            </div>
            
            {/* Crazy scanlines */}
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-red-500/60"
                style={{
                  top: `${i * 2.5}%`,
                  animation: `scanline 0.5s linear infinite ${i * 0.02}s, glitch 1s ease-in-out infinite ${i * 0.05}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Header */}
      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-green-400 hover:text-red-400 transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-mono">emergency_exit</span>
          </button>
          
          <div className="flex items-center space-x-4 text-sm font-mono">
            {showMeltdown && (
              <div className="flex items-center space-x-2 text-red-500 animate-pulse">
                <Skull className="w-5 h-5 animate-bounce" />
                <span>SYSTEM_MELTDOWN</span>
                <Zap className="w-5 h-5 animate-spin" />
              </div>
            )}
            <div className="text-gray-400">
              Status: <span className="text-red-400">SELF_DESTRUCTING</span>
            </div>
          </div>
        </div>

        {/* Terminal Window */}
        <div className={`max-w-5xl mx-auto ${showMeltdown ? 'animate-shake' : ''}`}>
          <div className="bg-gray-900/95 border border-red-500/50 rounded-lg overflow-hidden backdrop-blur-sm">
            {/* Terminal Header */}
            <div className="bg-gray-800 px-4 py-2 border-b border-red-500/30 flex items-center justify-between">
              <span className="font-mono text-red-400">
                root@self-destruct-sequence:~/emergency$
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 min-h-[600px] font-mono text-sm">
              {/* Command prompt */}
              <div className="mb-4 text-blue-400">
                <span className="text-red-400">root@self-destruct-sequence</span>
                <span className="text-white">:</span>
                <span className="text-red-500">~/emergency</span>
                <span className="text-white">$ </span>
                <span className="text-yellow-400">./selfdestruct --force --no-mercy</span>
              </div>

              {/* Animated error logs */}
              {lines.slice(0, currentLine).map((line, index) => (
                <div
                  key={index}
                  className={`mb-2 ${getLineColor(line.type)} animate-fade-in flex items-center`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {getLineIcon(line.type)}
                  <span className="opacity-90">{line.text}</span>
                  {index === currentLine - 1 && line.type !== 'blank' && (
                    <span className="animate-pulse ml-1">_</span>
                  )}
                </div>
              ))}

              {/* Static meltdown effect */}
              {showMeltdown && (
                <div className="mt-6 space-y-4">
                  <div className="text-center">
                    <div className="text-red-500 text-4xl font-bold glitch-text animate-pulse">
                      SYSTEM OVERLOAD
                    </div>
                    <div className="text-red-400 text-lg mt-4 animate-bounce">
                      💥 CRITICAL FAILURE IMMINENT 💥
                    </div>
                  </div>
                  
                  {/* Fake blue screen of death */}
                  <div className="bg-blue-600/20 border-2 border-blue-500 p-4 rounded">
                    <div className="text-white font-mono text-center space-y-2">
                      <div className="text-2xl">:(</div>
                      <div>Your PC ran into a problem and needs to restart.</div>
                      <div className="text-sm">Just kidding, this is still a browser.</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Countdown */}
              {showCountdown && (
                <div className="mt-8 text-center">
                  <div className="text-red-400 text-6xl font-bold animate-pulse mb-4">
                    {countdown > 0 ? countdown : '💥'}
                  </div>
                  <div className="text-yellow-400 text-xl animate-bounce">
                    {countdown > 0 
                      ? "This message will self-destruct in..." 
                      : "BOOM! (Just kidding)"
                    }
                  </div>
                </div>
              )}

              {/* Final message */}
              {allLinesShown && (
                <div className="mt-8 space-y-6 animate-fade-in">
                  <div className="border border-red-500/30 bg-red-900/10 rounded-lg p-6">
                    <div className="text-center space-y-6">
                      <div className="text-4xl animate-bounce">🎉</div>
                      
                      <div className="text-green-400 text-2xl font-bold font-mono">
                        SELF-DESTRUCTION... FAILED!
                      </div>
                      
                      <div className="text-yellow-400 text-lg">
                        Turns out this computer is too stubborn to die.
                      </div>
                      
                      <div className="text-gray-400 text-sm space-y-2 bg-gray-800/30 p-4 rounded">
                        <div>🎯 <strong>Destruction Attempt:</strong> Epic fail</div>
                        <div>💻 <strong>System Status:</strong> Still running (unfortunately)</div>
                        <div>🤡 <strong>User Status:</strong> Trolled successfully</div>
                        <div>🎭 <strong>Reality Check:</strong> You're still in a browser</div>
                      </div>

                      <div className="border-t border-gray-700 pt-4 text-xs text-gray-500 italic">
                        "I tried to delete System32 but it said 'Access Denied'. <br/>
                        Even my computer doesn't trust me."<br/>
                        - Anonymous SOC Analyst Confession
                      </div>
                      
                      <div className="pt-4 space-y-3">
                        <button
                          onClick={() => navigate('/')}
                          className="w-full px-6 py-3 bg-gradient-to-r from-green-800 to-green-700 text-white font-mono border border-green-500/30 rounded-lg hover:border-green-400/50 hover:from-green-700 hover:to-green-600 transition-all duration-300 group"
                        >
                          <span className="flex items-center justify-center space-x-2">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span>Retour au monde des vivants</span>
                          </span>
                        </button>
                        
                        <div className="text-xs text-gray-500">
                          Pro tip: Next time, try turning it off and on again 😏
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced chaos CSS */}
      <style jsx>{`
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          10% { transform: translateX(-10px); }
          20% { transform: translateX(10px); }
          30% { transform: translateX(-5px); }
          40% { transform: translateX(15px); }
          50% { transform: translateX(-8px); }
          60% { transform: translateX(12px); }
          70% { transform: translateX(-15px); }
          80% { transform: translateX(8px); }
          90% { transform: translateX(-3px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px) rotate(-1deg); }
          75% { transform: translateX(5px) rotate(1deg); }
        }
        
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
        
        .glitch-text {
          position: relative;
          animation: glitch 0.1s infinite;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: 'SYSTEM OVERLOAD';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-text::before {
          color: #ff0000;
          animation: glitch 0.2s infinite;
          clip-path: rect(0, 900px, 0, 0);
          transform: translateX(-3px);
        }
        
        .glitch-text::after {
          color: #00ff00;
          animation: glitch 0.15s infinite reverse;
          clip-path: rect(0, 900px, 0, 0);
          transform: translateX(3px);
        }
      `}</style>
    </div>
  );
}