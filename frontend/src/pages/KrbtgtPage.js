import React, { useState, useEffect } from 'react';
import { ArrowLeft, Flame, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function KrbtgtPage() {
  const navigate = useNavigate();
  const [currentLine, setCurrentLine] = useState(0);
  const [showFire, setShowFire] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [allLinesShown, setAllLinesShown] = useState(false);

  const lines = [
    { text: '[*] Initiating Kerberoasting...', delay: 1000, type: 'info' },
    { text: '[*] Target: krbtgt@NEBULAHOST.TECH', delay: 800, type: 'info' },
    { text: '[*] Dumping ticket...', delay: 1200, type: 'info' },
    { text: '[!] Warning: Ticket smells like barbecue', delay: 1000, type: 'warning' },
    { text: '[!] AES256-SHA1 not supported on toaster', delay: 1200, type: 'warning' },
    { text: '[x] Fail: Ticket has gone stale', delay: 800, type: 'error' },
    { text: '[x] Error: krbtgt roasted... too hard. It\'s now burnt.', delay: 1000, type: 'error' },
    { text: '[!] SYSTEM: 🧯 Emergency detected. Launching fire suppression...', delay: 1500, type: 'critical' }
  ];

  const explosionASCII = `
         .-"-.
        /     \\
       | () () |
        \\  ^  /
         |||||
         |||||
    `;

  const fireASCII = `
       (  )   (   )  )
        ) (  (  (  ( (
       ( )  )   ) )  )
      (  (   (  (   ) )
       ) )  ) (  )  (
        (  ( (   ) ) 
      ^^^^^^^^^^^^^^^^^^^
      🔥 KRBTGT OVERCOOKED 🔥
    `;

  useEffect(() => {
    if (currentLine < lines.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, lines[currentLine]?.delay || 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Tous les lignes sont affichées, déclencher les effets
      const fireTimer = setTimeout(() => {
        setShowFire(true);
        setShowExplosion(true);
        
        setTimeout(() => {
          setAllLinesShown(true);
        }, 3000);
      }, 1000);
      
      return () => clearTimeout(fireTimer);
    }
  }, [currentLine, lines]);

  const getLineColor = (type) => {
    switch (type) {
      case 'info': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      case 'critical': return 'text-red-500 animate-pulse';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-orange-900/10"></div>
        
        {/* Glitch scanlines when fire starts */}
        {showFire && (
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full h-px bg-red-500/30 animate-pulse"
                style={{
                  top: `${i * 7}%`,
                  animation: `scanline 1.5s linear infinite ${i * 0.1}s`
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
            <span className="font-mono">exit_kerberoasting</span>
          </button>
          
          {showFire && (
            <div className="flex items-center space-x-2 text-red-500 animate-bounce">
              <Flame className="w-6 h-6" />
              <span className="font-mono text-sm">OVERHEATING</span>
              <Zap className="w-6 h-6" />
            </div>
          )}
        </div>

        {/* Terminal Window */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/90 border border-green-500/30 rounded-lg overflow-hidden backdrop-blur-sm">
            {/* Terminal Header */}
            <div className="bg-gray-800 px-4 py-2 border-b border-green-500/30 flex items-center justify-between">
              <span className="font-mono text-green-400">fenrir@kerberoasting:~/attack$</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${showFire ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 min-h-[400px] font-mono text-sm">
              {lines.slice(0, currentLine).map((line, index) => (
                <div
                  key={index}
                  className={`mb-2 ${getLineColor(line.type)} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="opacity-90">{line.text}</span>
                  {index === currentLine - 1 && <span className="animate-pulse">_</span>}
                </div>
              ))}

              {/* Fire Animation */}
              {showFire && (
                <div className="mt-8 text-center">
                  <div className="text-red-500 animate-bounce">
                    <pre className="text-xs leading-tight whitespace-pre">
                      {fireASCII}
                    </pre>
                  </div>
                </div>
              )}

              {/* Explosion Effect */}
              {showExplosion && (
                <div className="mt-4 text-center">
                  <div className="text-yellow-400 animate-pulse">
                    <pre className="text-sm leading-tight whitespace-pre">
                      {explosionASCII}
                    </pre>
                  </div>
                  <div className="mt-4 text-red-400 animate-bounce">
                    <p className="text-lg font-bold">💥 BOOM! 💥</p>
                  </div>
                </div>
              )}

              {/* Final Message */}
              {allLinesShown && (
                <div className="mt-8 space-y-4 animate-fade-in">
                  <div className="border-t border-gray-700 pt-6">
                    <div className="text-center space-y-4">
                      <div className="text-yellow-400 text-lg font-mono">
                        "Lesson learned: Never roast the krbtgt unsupervised."
                      </div>
                      
                      <div className="text-gray-400 text-sm italic">
                        - Fenrir's Security Cookbook, Chapter 404: "How NOT to Kerberoast"
                      </div>
                      
                      <div className="pt-4">
                        <button
                          onClick={() => navigate('/')}
                          className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-green-400 font-mono border border-green-500/30 rounded-lg hover:border-green-400/50 hover:from-green-900/20 hover:to-blue-900/20 transition-all duration-300 group"
                        >
                          <span className="flex items-center space-x-2">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span>Retourner au terminal</span>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Screen shake effect when explosion happens */}
      <style jsx>{`
        ${showExplosion ? `
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out 3;
          }
        ` : ''}
      `}</style>
      
      <div className={`fixed inset-0 pointer-events-none ${showExplosion ? 'animate-shake' : ''}`}></div>
    </div>
  );
}