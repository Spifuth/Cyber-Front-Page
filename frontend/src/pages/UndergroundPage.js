import React, { useState, useEffect } from 'react';
import { ArrowLeft, Eye, EyeOff, Skull, Wifi, WifiOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UndergroundPage() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const [glitchText, setGlitchText] = useState('UNDERGROUND');

  useEffect(() => {
    // Connection animation
    const timer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    // Glitch effect for title
    const glitchTimer = setInterval(() => {
      const glitchChars = ['U', 'N', 'D', 'E', 'R', 'G', 'R', 'O', 'U', 'N', 'D'];
      const randomGlitch = glitchChars.map(char => 
        Math.random() > 0.8 ? String.fromCharCode(33 + Math.random() * 94) : char
      ).join('');
      setGlitchText(randomGlitch);
      
      setTimeout(() => setGlitchText('UNDERGROUND'), 100);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(glitchTimer);
    };
  }, []);

  const secretFiles = [
    { name: 'shadow_protocols.md', size: '2.3KB', date: '2024-01-15' },
    { name: 'network_topology.json', size: '847B', date: '2024-01-10' },
    { name: 'incident_reports.log', size: '15.2KB', date: '2024-01-08' },
    { name: 'honeypot_data.db', size: '128MB', date: '2024-01-05' }
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Animated background - more intense */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-green-900/20"></div>
        
        {/* Scanlines - more prominent */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-green-500/20"
              style={{
                top: `${i * 5}%`,
                animation: `scanline 2s linear infinite ${i * 0.1}s`
              }}
            />
          ))}
        </div>

        {/* Glitch overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" seed="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)" opacity="0.05"/%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-green-400 hover:text-red-400 transition-colors duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-mono">exit_underground</span>
          </button>

          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-2 text-green-400">
                <Wifi className="w-5 h-5" />
                <span className="font-mono text-sm">SECURE_CONNECTION</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-400">
                <WifiOff className="w-5 h-5" />
                <span className="font-mono text-sm">CONNECTING...</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-mono font-bold mb-4 text-red-400 relative">
            <span className="bg-gradient-to-r from-red-400 via-green-400 to-red-400 bg-clip-text text-transparent">
              {glitchText}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-green-500/20 blur-3xl -z-10"></div>
          </h1>
          
          <div className="font-mono text-lg text-gray-400 mb-8">
            <span className="animate-pulse">ACCESS LEVEL: CLASSIFIED</span>
          </div>
          
          {!isConnected && (
            <div className="font-mono text-red-400">
              <span className="animate-pulse">Establishing encrypted tunnel...</span>
            </div>
          )}
        </div>

        {isConnected && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Warning Banner */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 flex items-center space-x-4">
              <Skull className="w-8 h-8 text-red-400 animate-pulse" />
              <div>
                <h3 className="font-mono text-red-400 mb-2">ATTENTION: ZONE RESTREINTE</h3>
                <p className="text-gray-300 text-sm">
                  Vous êtes maintenant dans une zone sécurisée. Toute activité est loggée et monitored.
                </p>
              </div>
            </div>

            {/* Terminal Window */}
            <div className="bg-gray-900/50 border border-green-500/20 rounded-lg overflow-hidden backdrop-blur-sm">
              <div className="bg-gray-800 px-4 py-2 border-b border-green-500/30 flex items-center justify-between">
                <span className="font-mono text-green-400">fenrir@underground:~/classified$</span>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="p-6 font-mono text-sm space-y-2">
                <div className="text-green-400"># Bienvenue dans la zone underground</div>
                <div className="text-gray-400"># Ici résident les projets secrets, les expérimentations</div>
                <div className="text-gray-400"># et les outils qui ne verront jamais la lumière</div>
                <div className="text-green-400 mt-4"># ls -la classified/</div>
              </div>
            </div>

            {/* File System */}
            <div className="bg-gray-900/50 border border-green-500/20 rounded-lg backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-mono text-green-400 text-lg"># CLASSIFIED FILES</h3>
                  <button
                    onClick={() => setShowSecrets(!showSecrets)}
                    className="flex items-center space-x-2 px-3 py-1 bg-gray-800 border border-green-500/30 rounded text-green-400 hover:border-green-400/50 transition-colors duration-300"
                  >
                    {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span className="font-mono text-sm">{showSecrets ? 'HIDE' : 'SHOW'}</span>
                  </button>
                </div>

                {showSecrets && (
                  <div className="space-y-2 animate-fade-in">
                    {secretFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-black/30 rounded border border-gray-700/50 hover:border-red-500/50 transition-colors duration-300 group cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="font-mono text-red-400 group-hover:text-red-300">
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-6 text-gray-500 text-sm">
                          <span>{file.size}</span>
                          <span>{file.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Secret Message */}
            <div className="bg-gradient-to-r from-gray-900/50 to-red-900/20 border border-red-500/20 rounded-lg p-8 text-center">
              <div className="font-mono text-red-400 mb-4 text-lg">
                "In the depths of cyberspace, we are the guardians."
              </div>
              <div className="font-mono text-gray-400 text-sm">
                - Fenrir, SOC Underground Division
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}