import React, { useState } from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Terminal from '../components/Terminal';
import GitHubLink from '../components/GitHubLink';
import ToolsLink from '../components/ToolsLink';
import { Terminal as TerminalIcon, X } from 'lucide-react';

export default function HomePage() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-blue-900/10 to-violet-900/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="rgba(34,197,94,0.03)" fill-rule="evenodd"%3E%3Cpath d="M0 0h20v20H0V0zm20 20h20v20H20V20z"/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
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
              <Terminal onNavigateToUnderground={() => window.location.href = '/underground'} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}