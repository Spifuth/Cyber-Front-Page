import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Terminal from '../components/Terminal';
import GitHubLink from '../components/GitHubLink';
import ToolsLink from '../components/ToolsLink';
import CyberMaze from '../components/CyberMaze';
import { Terminal as TerminalIcon, X, Palette, Eye, EyeOff } from 'lucide-react';

export default function HomePage() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMazeEnabled, setIsMazeEnabled] = useState(true);
  const [mazeColor, setMazeColor] = useState('green');
  const [mazeOpacity, setMazeOpacity] = useState(0.25);
  const navigate = useNavigate();

  const cycleColors = () => {
    const colors = ['green', 'blue', 'purple', 'red', 'yellow'];
    const currentIndex = colors.indexOf(mazeColor);
    const nextColor = colors[(currentIndex + 1) % colors.length];
    setMazeColor(nextColor);
  };

  const toggleOpacity = () => {
    setMazeOpacity(prev => prev === 0.25 ? 0.1 : 0.25);
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Cyber Maze Background with toggle */}
      <CyberMaze 
        key={`${isMazeEnabled}-${mazeColor}-${mazeOpacity}`}
        isEnabled={isMazeEnabled} 
        color={mazeColor} 
        opacity={mazeOpacity} 
      />
      
      {/* Maze Control Panel */}
      <div className="fixed top-8 right-8 z-50 flex flex-col gap-2">
        <button
          onClick={() => setIsMazeEnabled(!isMazeEnabled)}
          className="bg-gray-900/90 border border-blue-500/50 text-blue-400 p-3 rounded-lg hover:bg-gray-800/90 hover:border-blue-400 transition-all duration-300 backdrop-blur-sm group"
          title={`${isMazeEnabled ? 'Disable' : 'Enable'} Cyber Maze`}
        >
          {isMazeEnabled ? (
            <EyeOff className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          )}
        </button>
        
        {isMazeEnabled && (
          <>
            <button
              onClick={cycleColors}
              className="bg-gray-900/90 border border-violet-500/50 text-violet-400 p-3 rounded-lg hover:bg-gray-800/90 hover:border-violet-400 transition-all duration-300 backdrop-blur-sm group"
              title="Change Maze Color"
            >
              <Palette className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </button>
            
            <button
              onClick={toggleOpacity}
              className="bg-gray-900/90 border border-green-500/50 text-green-400 p-2 rounded-lg hover:bg-gray-800/90 hover:border-green-400 transition-all duration-300 backdrop-blur-sm group text-xs font-mono"
              title="Toggle Opacity"
            >
              {Math.round(mazeOpacity * 100)}%
            </button>
          </>
        )}
      </div>
      
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-blue-900/10 to-violet-900/20"></div>
        <div className="absolute inset-0 bg-pattern-grid opacity-20"></div>
        {/* Scanlines effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <Hero />
        <About />
        <Projects />
        
        <div className="flex justify-center items-center gap-8 py-16">
          <GitHubLink />
          <ToolsLink />
        </div>

        {/* Terminal Toggle Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className="bg-gray-900/90 border border-green-500/50 text-green-400 p-4 rounded-lg hover:bg-gray-800/90 hover:border-green-400 transition-all duration-300 backdrop-blur-sm group"
          >
            {isTerminalOpen ? (
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <TerminalIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Terminal Modal */}
        {isTerminalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl max-h-[80vh] bg-gray-900 border border-green-500/50 rounded-lg overflow-hidden">
              <Terminal 
                onNavigateToUnderground={() => {
                  setIsTerminalOpen(false);
                  navigate('/underground');
                }}
                onNavigateToKrbtgt={() => {
                  setIsTerminalOpen(false);
                  navigate('/krbtgt');
                }}
                onNavigateToSelfDestruct={() => {
                  setIsTerminalOpen(false);
                  navigate('/selfdestruct');
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}