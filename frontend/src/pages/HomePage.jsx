import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Terminal from '../components/Terminal';
import GitHubLink from '../components/GitHubLink';
import ToolsLink from '../components/ToolsLink';
import CyberMaze from '../components/CyberMaze';
import { Terminal as TerminalIcon, X, Palette, Eye, EyeOff, User, Clock, Code, Server, Award, Mail, BookOpen, FileText } from 'lucide-react';

export default function HomePage() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isMazeEnabled, setIsMazeEnabled] = useState(true);
  const [mazeColor, setMazeColor] = useState('green');
  const [mazeOpacity, setMazeOpacity] = useState(0.25);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const navigate = useNavigate();
  const colorPickerRef = useRef(null);
  const terminalButtonRef = useRef(null);
  const terminalDialogRef = useRef(null);

  useEffect(() => {
    if (!isTerminalOpen) {
      terminalButtonRef.current?.focus();
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsTerminalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isTerminalOpen]);

  const colorOptions = [
    { name: 'green', color: 'rgb(34, 197, 94)', label: 'Matrix Green' },
    { name: 'blue', color: 'rgb(59, 130, 246)', label: 'Cyber Blue' },
    { name: 'purple', color: 'rgb(139, 92, 246)', label: 'Neon Purple' },
    { name: 'red', color: 'rgb(239, 68, 68)', label: 'Alert Red' },
    { name: 'yellow', color: 'rgb(245, 158, 11)', label: 'Warning Yellow' }
  ];

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  const selectColor = (colorName) => {
    setMazeColor(colorName);
    setShowColorPicker(false);
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
          type="button"
          onClick={() => setIsMazeEnabled(!isMazeEnabled)}
          className="bg-gray-900/90 border border-blue-500/50 text-blue-400 p-3 rounded-lg hover:bg-gray-800/90 hover:border-blue-400 transition-all duration-300 backdrop-blur-sm group"
          title={`${isMazeEnabled ? 'Disable' : 'Enable'} Cyber Maze`}
          aria-pressed={isMazeEnabled}
          aria-label={isMazeEnabled ? 'Désactiver le fond Cyber Maze' : 'Activer le fond Cyber Maze'}
        >
          {isMazeEnabled ? (
            <EyeOff className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          ) : (
            <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          )}
        </button>
        
        {isMazeEnabled && (
          <>
            <div className="relative" ref={colorPickerRef}>
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="bg-gray-900/90 border border-violet-500/50 text-violet-400 p-3 rounded-lg hover:bg-gray-800/90 hover:border-violet-400 transition-all duration-300 backdrop-blur-sm group"
                title="Change Maze Color"
                aria-haspopup="menu"
                aria-expanded={showColorPicker}
                aria-controls="maze-color-menu"
                aria-label="Changer la couleur du fond Cyber Maze"
              >
                <Palette className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </button>
              
              {/* Color Picker Menu */}
              {showColorPicker && (
                <div
                  id="maze-color-menu"
                  role="menu"
                  className="absolute right-0 top-full mt-2 bg-gray-900/95 border border-violet-500/30 rounded-lg p-3 backdrop-blur-sm min-w-[200px] shadow-lg animate-fade-in"
                >
                  <div className="text-violet-400 text-xs font-mono mb-3 text-center">
                    Select Maze Color
                  </div>
                  <div className="space-y-2">
                    {colorOptions.map((option) => (
                      <button
                        key={option.name}
                        type="button"
                        role="menuitemradio"
                        aria-checked={mazeColor === option.name}
                        aria-label={option.label}
                        onClick={() => selectColor(option.name)}
                        className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-all duration-300 hover:bg-gray-800/50 ${
                          mazeColor === option.name
                            ? 'bg-gray-700/50 border border-violet-400/30'
                            : 'border border-transparent'
                        }`}
                      >
                        <div 
                          className="w-4 h-4 rounded-full border border-gray-600"
                          style={{ backgroundColor: option.color }}
                        ></div>
                        <span className="text-gray-300 text-sm font-mono flex-1 text-left">
                          {option.label}
                        </span>
                        {mazeColor === option.name && (
                          <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={toggleOpacity}
              className="bg-gray-900/90 border border-green-500/50 text-green-400 p-2 rounded-lg hover:bg-gray-800/90 hover:border-green-400 transition-all duration-300 backdrop-blur-sm group text-xs font-mono"
              title="Toggle Opacity"
              aria-label="Basculer l'opacité du fond Cyber Maze"
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
        
        {/* Professional Sections */}
        <section className="py-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Professional Portfolio
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                Explore my expertise, experience, and professional achievements
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Resume/CV */}
              <div 
                onClick={() => navigate('/resume')}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 rounded-lg">
                    <User className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs border border-blue-500/30 bg-blue-500/10 text-blue-400">
                    CV/RESUME
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
                  Resume & CV
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Professional background, education, and career summary
                </p>
                <div className="text-green-400 text-sm font-mono">→ View Resume</div>
              </div>

              {/* Timeline */}
              <div 
                onClick={() => navigate('/timeline')}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs border border-blue-500/30 bg-blue-500/10 text-blue-400">
                    CAREER
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                  Career Timeline
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Professional journey, roles, and key achievements over time
                </p>
                <div className="text-blue-400 text-sm font-mono">→ View Timeline</div>
              </div>

              {/* Tech Stack */}
              <div 
                onClick={() => navigate('/stack')}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-lg">
                    <Code className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs border border-purple-500/30 bg-purple-500/10 text-purple-400">
                    TECHNICAL
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-purple-400 transition-colors">
                  Tech Stack
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Technologies, frameworks, and tools with expertise levels
                </p>
                <div className="text-purple-400 text-sm font-mono">→ View Stack</div>
              </div>

              {/* Skills Radar */}
              <div 
                onClick={() => navigate('/skills')}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-500/20 rounded-lg">
                    <FileText className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                    SKILLS
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-yellow-400 transition-colors">
                  Skills Matrix
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Visual skills radar chart and competency analysis
                </p>
                <div className="text-yellow-400 text-sm font-mono">→ View Skills</div>
              </div>

              {/* Infrastructure */}
              <div 
                onClick={() => navigate('/infra')}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500/20 rounded-lg">
                    <Server className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs border border-red-500/30 bg-red-500/10 text-red-400">
                    INFRASTRUCTURE
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-red-400 transition-colors">
                  Infrastructure
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  DevOps practices, cloud platforms, and system architecture
                </p>
                <div className="text-red-400 text-sm font-mono">→ View Infra</div>
              </div>

              {/* Certifications */}
              <div 
                onClick={() => navigate('/certs')}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-indigo-500/20 rounded-lg">
                    <Award className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
                    CREDENTIALS
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-indigo-400 transition-colors">
                  Certifications
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Professional certifications, badges, and achievements
                </p>
                <div className="text-indigo-400 text-sm font-mono">→ View Certs</div>
              </div>

              {/* Learning Resources */}
              <div 
                onClick={() => navigate('/learning')}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-teal-500/20 rounded-lg">
                    <BookOpen className="h-6 w-6 text-teal-400" />
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs border border-teal-500/30 bg-teal-500/10 text-teal-400">
                    LEARNING
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-teal-400 transition-colors">
                  Learning Path
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Continuous learning resources, courses, and knowledge base
                </p>
                <div className="text-teal-400 text-sm font-mono">→ View Learning</div>
              </div>

              {/* Contact */}
              <div 
                onClick={() => navigate('/contact')}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-orange-500/20 rounded-lg">
                    <Mail className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs border border-orange-500/30 bg-orange-500/10 text-orange-400">
                    CONTACT
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-orange-400 transition-colors">
                  Get In Touch
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Contact information, availability, and communication channels
                </p>
                <div className="text-orange-400 text-sm font-mono">→ Contact Me</div>
              </div>

              {/* System Logs */}
              <div 
                onClick={() => navigate('/logs')}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-pink-500/20 rounded-lg">
                    <FileText className="h-6 w-6 text-pink-400" />
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs border border-pink-500/30 bg-pink-500/10 text-pink-400">
                    SYSTEM
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-pink-400 transition-colors">
                  System Logs
                </h3>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Development logs, system monitoring, and activity tracking
                </p>
                <div className="text-pink-400 text-sm font-mono">→ View Logs</div>
              </div>
            </div>
          </div>
        </section>
        
        <div className="flex justify-center items-center gap-8 py-16">
          <GitHubLink />
          <ToolsLink />
        </div>

        {/* Terminal Toggle Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            type="button"
            ref={terminalButtonRef}
            onClick={() => setIsTerminalOpen(!isTerminalOpen)}
            className="bg-gray-900/90 border border-green-500/50 text-green-400 p-4 rounded-lg hover:bg-gray-800/90 hover:border-green-400 transition-all duration-300 backdrop-blur-sm group"
            aria-pressed={isTerminalOpen}
            aria-haspopup="dialog"
            aria-expanded={isTerminalOpen}
            aria-controls="cyber-terminal-modal"
            aria-label={isTerminalOpen ? 'Fermer le terminal interactif' : 'Ouvrir le terminal interactif'}
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-2 sm:p-4" role="presentation">
            <div
              id="cyber-terminal-modal"
              ref={terminalDialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="terminal-window-title"
              className="w-full h-full sm:h-[85vh] md:h-[90vh] lg:h-[85vh] xl:max-w-6xl xl:h-[80vh] bg-gray-900 border border-green-500/50 rounded-lg overflow-hidden flex flex-col"
              tabIndex={-1}
            >
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
