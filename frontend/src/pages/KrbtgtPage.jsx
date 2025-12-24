import { useState, useEffect } from 'react';
import { ArrowLeft, Flame, Zap, Skull, AlertTriangle, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function KrbtgtPage() {
  const navigate = useNavigate();
  const [currentLine, setCurrentLine] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const [showRoastedEffect, setShowRoastedEffect] = useState(false);
  const [allLinesShown, setAllLinesShown] = useState(false);
  const [browserInfo, setBrowserInfo] = useState({});

  // Browser detection function
  const detectBrowser = () => {
    const userAgent = navigator.userAgent;
    let browser = 'unknown';
    let message = "Nice try. Unknown browser detected. Still not Burp.";
    let icon = "🌐";

    if (userAgent.includes('Chrome') && !userAgent.includes('Edge') && !userAgent.includes('OPR')) {
      if (userAgent.includes('Brave')) {
        browser = 'Brave';
        message = "Brave? More like 'please-Google-don't-look' mode.";
        icon = "🦁";
      } else {
        browser = 'Chrome';
        message = "Your telemetry has already been sent to Mountain View. You're basically livestreaming your attack.";
        icon = "🌈";
      }
    } else if (userAgent.includes('Firefox')) {
      browser = 'Firefox';
      message = "You think you're safe with Firefox? Please, Mozillians are watching.";
      icon = "🦊";
    } else if (userAgent.includes('Edge')) {
      browser = 'Edge';
      message = "Edge user detected. We called Clippy and he's disappointed.";
      icon = "📎";
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      browser = 'Safari';
      message = "Welcome, iOS pentester. You've already lost.";
      icon = "🍎";
    } else if (userAgent.includes('OPR') || userAgent.includes('Opera')) {
      browser = 'Opera';
      message = "Opera GX? Cyberpunk isn't a browser theme, dude.";
      icon = "🎭";
    }

    return { browser, message, icon };
  };

  const lines = [
    { text: '[!] Initiating browser security check...', delay: 800, type: 'warning' },
    { text: `[!] Browser check: ${browserInfo.browser} detected ${browserInfo.icon}`, delay: 1000, type: 'warning' },
    { text: `[x] ${browserInfo.message}`, delay: 1500, type: 'error' },
    { text: '[x] Error: Burp Suite browser not detected', delay: 1000, type: 'error' },
    { text: '[!] Only Burp\'s Chromium-based browser can bypass surveillance', delay: 1200, type: 'warning' },
    { text: '', delay: 500, type: 'blank' }, // Separator
    { text: '[*] Proceeding anyway... (YOLO mode activated)', delay: 1000, type: 'info' },
    { text: '[*] Initiating Kerberoasting...', delay: 1000, type: 'info' },
    { text: '[*] Target: krbtgt@NEBULAHOST.TECH', delay: 800, type: 'info' },
    { text: '[*] Dumping service ticket...', delay: 1200, type: 'info' },
    { text: '[!] Warning: AES256 encryption not supported on this toaster', delay: 1000, type: 'warning' },
    { text: '[x] Error: krbtgt has detected impure intentions', delay: 1200, type: 'error' },
    { text: '[!] SYSTEM CHECK: Verifying environment...', delay: 1500, type: 'warning' },
    { text: '', delay: 800, type: 'blank' }, // Pause animée
    { text: '[x] Error: You do not possess the AZ-900 certification', delay: 1000, type: 'error' },
    { text: '[x] Error: Tails OS not detected — operation aborted', delay: 1000, type: 'error' },
    { text: '[!] Security Tip: Real pentesters use Tails. Not this... thing.', delay: 1500, type: 'warning' },
    { text: '[💀] Fatal: krbtgt roasted... too hard. It\'s now a charcoal blob.', delay: 2000, type: 'fatal' }
  ];

  const roastedPattern = Array(50).fill('#ROASTED').join(' ');

  useEffect(() => {
    // Initialize browser detection
    setBrowserInfo(detectBrowser());
  }, []);

  useEffect(() => {
    if (currentLine < lines.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, lines[currentLine]?.delay || 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Tous les lignes sont affichées, déclencher les effets finaux
      const glitchTimer = setTimeout(() => {
        setShowGlitch(true);
        
        setTimeout(() => {
          setShowRoastedEffect(true);
          
          setTimeout(() => {
            setAllLinesShown(true);
          }, 4000);
        }, 2000);
      }, 1000);
      
      return () => clearTimeout(glitchTimer);
    }
  }, [currentLine, lines]);

  const getLineColor = (type) => {
    switch (type) {
      case 'info': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'fatal': return 'text-red-500 animate-pulse font-bold';
      case 'blank': return 'text-transparent';
      default: return 'text-green-400';
    }
  };

  const getLineIcon = (type) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 inline mr-2" />;
      case 'fatal': return <Skull className="w-4 h-4 inline mr-2 animate-bounce" />;
      case 'warning': return <Monitor className="w-4 h-4 inline mr-2" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-orange-900/10"></div>
        
        {/* Glitch scanlines intensifiées */}
        {showGlitch && (
          <div className="absolute inset-0">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-red-500/50 animate-pulse"
                style={{
                  top: `${i * 4}%`,
                  animation: `scanline 1s linear infinite ${i * 0.05}s, glitch 2s ease-in-out infinite ${i * 0.1}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Roasted effect overlay */}
        {showRoastedEffect && (
          <div className="absolute inset-0 bg-red-900/30 animate-pulse">
            <div className="absolute inset-0 opacity-20 text-red-500 text-xs leading-none overflow-hidden whitespace-nowrap animate-bounce">
              {Array(20).fill(roastedPattern).join(' ')}
            </div>
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
            <span className="font-mono">exit_kerberoasting</span>
          </button>
          
          <div className="flex items-center space-x-4 text-sm font-mono">
            {showGlitch && (
              <div className="flex items-center space-x-2 text-red-500 animate-pulse">
                <Flame className="w-5 h-5" />
                <span>SYSTEM_OVERLOAD</span>
                <Zap className="w-5 h-5" />
              </div>
            )}
            <div className="text-gray-400">
              Browser: <span className="text-yellow-400">{browserInfo.browser}</span> |
              Target: <span className="text-red-400">krbtgt@NEBULAHOST.TECH</span>
            </div>
          </div>
        </div>

        {/* Terminal Window */}
        <div className={`max-w-5xl mx-auto ${showGlitch ? 'animate-shake' : ''}`}>
          <div className="bg-gray-900/95 border border-green-500/30 rounded-lg overflow-hidden backdrop-blur-sm">
            {/* Terminal Header */}
            <div className="bg-gray-800 px-4 py-2 border-b border-green-500/30 flex items-center justify-between">
              <span className="font-mono text-green-400">
                root@kerberoasting-lab:~/attacks/active-directory$
              </span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${showGlitch ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                <div className={`w-2 h-2 rounded-full ${showGlitch ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 min-h-[500px] font-mono text-sm">
              {/* Command prompt */}
              <div className="mb-4 text-blue-400">
                <span className="text-green-400">root@kerberoasting-lab</span>
                <span className="text-white">:</span>
                <span className="text-blue-500">~/attacks/active-directory</span>
                <span className="text-white">$ </span>
                <span className="text-yellow-400">python3 kerberoast.py --target krbtgt --stealth-mode</span>
              </div>

              {/* Animated logs */}
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

              {/* System verification pause animation */}
              {currentLine > 12 && currentLine < 14 && (
                <div className="my-4 flex items-center text-yellow-400">
                  <span>Scanning system environment</span>
                  <div className="ml-2 flex space-x-1">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}

              {/* Glitch Effect when roasted */}
              {showGlitch && (
                <div className="mt-6 space-y-2">
                  <div className="text-red-500 animate-pulse text-center">
                    <div className="text-2xl font-bold glitch-text mb-4">
                      SYSTEM FAILURE
                    </div>
                    <div className="text-lg animate-bounce">
                      💀 KRBTGT.EXE HAS STOPPED WORKING 💀
                    </div>
                    <div className="text-sm mt-2 text-red-400">
                      {browserInfo.icon} Browser: {browserInfo.browser} | Status: COMPROMISED
                    </div>
                  </div>
                </div>
              )}

              {/* Roasted flood effect */}
              {showRoastedEffect && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500/30 rounded">
                  <div className="text-red-400 text-center animate-pulse">
                    <div className="text-6xl mb-4">🔥</div>
                    <div className="text-xl font-bold mb-2">ROASTED STATUS: MAXIMUM</div>
                    <div className="text-sm opacity-75 overflow-hidden">
                      {Array(10).fill('#ROASTED #BURNT #OVERCOOKED ').join('')}
                    </div>
                  </div>
                </div>
              )}

              {/* Final HackTheBox style message */}
              {allLinesShown && (
                <div className="mt-8 space-y-6 animate-fade-in">
                  <div className="border border-red-500/30 bg-red-900/10 rounded-lg p-6">
                    <div className="text-center space-y-4">
                      <div className="text-red-400 text-2xl font-bold font-mono">
                        MISSION FAILED
                      </div>
                      
                      <div className="text-yellow-400 text-lg">
                        Try harder.
                      </div>
                      
                      <div className="text-gray-400 text-sm space-y-2">
                        <div>{browserInfo.icon} <strong>Browser Issue:</strong> {browserInfo.browser} detected - major OPSEC fail</div>
                        <div>🎯 <strong>Skill Issue Detected:</strong> Maybe try HackTheBox first?</div>
                        <div>📚 <strong>Certification Missing:</strong> AZ-900 required for krbtgt access</div>
                        <div>🐧 <strong>OS Recommendation:</strong> Tails Linux or GTFO</div>
                        <div>🔥 <strong>Result:</strong> krbtgt is now a BBQ snack</div>
                      </div>

                      <div className="border-t border-gray-700 pt-4 text-xs text-gray-500 italic">
                        "In Soviet Russia, krbtgt roasts YOU!"<br/>
                        - Fenrir's Pentesting Fails, Volume 404: "{browserInfo.browser} Edition"
                      </div>
                      
                      <div className="pt-4 space-y-3">
                        <button
                          onClick={() => navigate('/')}
                          className="w-full px-6 py-3 bg-gradient-to-r from-red-800 to-red-700 text-white font-mono border border-red-500/30 rounded-lg hover:border-red-400/50 hover:from-red-700 hover:to-red-600 transition-all duration-300 group"
                        >
                          <span className="flex items-center justify-center space-x-2">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span>Retour au terminal (avec la queue entre les jambes)</span>
                          </span>
                        </button>
                        
                        <div className="text-xs text-gray-500">
                          Pro tip: Next time, use Burp's browser or switch to Tails OS 🤡
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

      {/* Enhanced CSS animations */}
      <style jsx>{`
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out infinite;
        }
        
        .glitch-text {
          position: relative;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: 'SYSTEM FAILURE';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
        
        .glitch-text::before {
          color: #ff0000;
          animation: glitch 0.3s infinite;
          clip-path: rect(0, 900px, 0, 0);
        }
        
        .glitch-text::after {
          color: #00ff00;
          animation: glitch 0.3s infinite reverse;
          clip-path: rect(0, 900px, 0, 0);
        }
      `}</style>
    </div>
  );
}