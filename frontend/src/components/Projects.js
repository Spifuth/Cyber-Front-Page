import React from 'react';
import { ExternalLink, Code, Server, Activity, Shield } from 'lucide-react';
import { mockData } from '../mock/data';

export default function Projects() {
  const { projects } = mockData;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'production': return 'text-green-400 border-green-500/30';
      case 'actif': return 'text-blue-400 border-blue-500/30';
      case 'développement': return 'text-yellow-400 border-yellow-500/30';
      default: return 'text-gray-400 border-gray-500/30';
    }
  };

  const getProjectIcon = (title) => {
    if (title.includes('Monitoring')) return Activity;
    if (title.includes('Tools')) return Code;
    if (title.includes('Bot')) return Server;
    if (title.includes('proxy')) return Shield;
    return Code;
  };

  return (
    <section className="py-20 px-4 relative" id="projects">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-mono font-bold mb-4 text-green-400">
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              ./projects
            </span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-4"></div>
          <p className="text-gray-400 font-mono"># ls -la ~/projects/</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project) => {
            const IconComponent = getProjectIcon(project.title);
            return (
              <div
                key={project.id}
                className="group bg-gray-900/50 border border-green-500/20 rounded-lg overflow-hidden backdrop-blur-sm hover:border-green-400/50 transition-all duration-500 hover:transform hover:scale-[1.02]"
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden bg-gray-800">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <div className={`px-3 py-1 bg-black/70 border ${getStatusColor(project.status)} rounded-full text-xs font-mono backdrop-blur-sm`}>
                      {project.status}
                    </div>
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-6 h-6 text-green-400 group-hover:text-blue-400 transition-colors duration-300" />
                    <h3 className="text-xl font-mono font-semibold text-green-400 group-hover:text-blue-400 transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-gray-300 leading-relaxed text-sm">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-black/50 text-violet-300 text-xs font-mono border border-violet-500/30 rounded hover:border-violet-400/50 transition-colors duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="pt-4">
                    <button className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-gray-800 to-gray-700 text-green-400 font-mono text-sm border border-green-500/30 rounded-lg hover:border-green-400/50 hover:from-green-900/20 hover:to-blue-900/20 transition-all duration-300 group-hover:text-blue-400">
                      <ExternalLink className="w-4 h-4" />
                      <span>view_project</span>
                    </button>
                  </div>
                </div>

                {/* Scan line effect */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent animate-pulse"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}