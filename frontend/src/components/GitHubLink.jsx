import React from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { mockData } from '../mock/data';

export default function GitHubLink() {
  const { github } = mockData;

  return (
    <div className="group">
      <a
        href={github.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-4 bg-gray-900/50 border border-green-500/20 rounded-lg p-6 backdrop-blur-sm hover:border-green-400/50 hover:bg-green-500/5 transition-all duration-500 transform hover:scale-105"
      >
        {/* Avatar */}
        <div className="relative">
          <img
            src={github.avatar}
            alt="GitHub Avatar"
            className="w-16 h-16 rounded-full border-2 border-green-500/30 group-hover:border-green-400 transition-colors duration-300"
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Github className="w-5 h-5 text-green-400 group-hover:text-blue-400 transition-colors duration-300" />
            <h3 className="text-lg font-mono font-semibold text-green-400 group-hover:text-blue-400 transition-colors duration-300">
              GitHub
            </h3>
          </div>
          <p className="text-gray-400 text-sm font-mono">
            @{github.username}
          </p>
          <div className="flex items-center space-x-2 mt-2 text-gray-500 text-xs">
            <span>View repositories</span>
            <ExternalLink className="w-3 h-3 group-hover:text-green-400 transition-colors duration-300" />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="flex flex-col space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-green-500/30 rounded-full group-hover:bg-green-400/60 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </a>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
}