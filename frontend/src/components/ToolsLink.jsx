import React from 'react';
import { Wrench, ExternalLink, Zap } from 'lucide-react';
import { mockData } from '../mock/data';

export default function ToolsLink() {
  const { tools } = mockData;

  return (
    <div className="group">
      <a
        href={tools.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-4 bg-gray-900/50 border border-blue-500/20 rounded-lg p-6 backdrop-blur-sm hover:border-blue-400/50 hover:bg-blue-500/5 transition-all duration-500 transform hover:scale-105"
      >
        {/* Icon */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-violet-500/20 rounded-full border-2 border-blue-500/30 group-hover:border-blue-400 flex items-center justify-center transition-all duration-300">
            <Wrench className="w-8 h-8 text-blue-400 group-hover:text-violet-400 group-hover:rotate-12 transition-all duration-300" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-mono font-semibold text-blue-400 group-hover:text-violet-400 transition-colors duration-300">
              {tools.name}
            </h3>
          </div>
          <p className="text-gray-400 text-sm font-mono mb-2">
            {tools.description}
          </p>
          <div className="flex items-center space-x-2 text-gray-500 text-xs">
            <span>Launch tools</span>
            <ExternalLink className="w-3 h-3 group-hover:text-blue-400 transition-colors duration-300" />
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex flex-col items-center space-y-1">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-mono">ONLINE</span>
        </div>
      </a>

      {/* Hover Effects */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse"></div>
        <div className="absolute top-1/2 right-0 w-px h-8 bg-gradient-to-b from-transparent via-violet-400/50 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
}