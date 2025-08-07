import React, { useState, useEffect } from 'react';
import { ExternalLink, Code, Server, Activity, Shield, Github, Image, X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

// ProjectCard Component
const ProjectCard = ({ project, onImageClick, viewMode, featured }) => {
  const getProjectIcon = (title) => {
    if (title.includes('Monitoring')) return Activity;
    if (title.includes('Tools')) return Code;
    if (title.includes('Bot')) return Server;
    if (title.includes('proxy')) return Shield;
    return Code;
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'active': 'text-green-400 border-green-500/30 bg-green-500/10',
      'completed': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      'beta': 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
      'in_development': 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      'archived': 'text-gray-400 border-gray-500/30 bg-gray-500/10'
    };
    return statusMap[status] || 'text-gray-400 border-gray-500/30 bg-gray-500/10';
  };

  const IconComponent = getProjectIcon(project.title);

  if (viewMode === 'visual') {
    return (
      <div className={`group relative bg-gray-900/50 backdrop-blur-sm border rounded-lg overflow-hidden hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 ${
        featured ? 'border-yellow-500/50 ring-1 ring-yellow-500/20' : 'border-gray-700/50'
      }`}>
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-2 left-2 z-10 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs border border-yellow-500/30">
            ⭐ Featured
          </div>
        )}

        {/* Project Image/Screenshots */}
        <div className="relative h-48 bg-gray-800 overflow-hidden">
          {project.screenshots && project.screenshots.length > 0 ? (
            <div className="relative h-full">
              <img
                src={project.screenshots[0].url}
                alt={project.screenshots[0].alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => onImageClick(project, 0)}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMUYyOTM3Ii8+CjxwYXRoIGQ9Ik0xNzUgMTMwSDE0NVYxNjBIMTc1VjEzMFoiIGZpbGw9IiM0QjU1NjMiLz4KPHA+dGggZD0iTTE5NSAxNzBIMjI1VjIwMEgxOTVWMTcwWiIgZmlsbD0iIzRCNTU2MyIvPgo8cGF0aCBkPSJNMTQ1IDE3MEgxNzVWMjAwSDE0NVYxNzBaIiBmaWxsPSIjNEI1NTYzIi8+CjwvZz4KPC9zdmc+';
                }}
              />
              {project.screenshots.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  +{project.screenshots.length - 1} more
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Eye className="h-8 w-8 text-white" />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-800">
              <IconComponent className="h-16 w-16 text-gray-600" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <div className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
              {project.status}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <IconComponent className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors">
              {project.title}
            </h3>
          </div>
          
          <p className="text-gray-400 mb-4 leading-relaxed">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(project.technologies || project.tech || []).map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {(project.github_url || project.github) && (
              <a
                href={project.github_url || project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
              >
                <Github className="h-4 w-4" />
                Code
              </a>
            )}
            {(project.live_demo || project.link) && project.live_demo !== '#' && project.link !== '#' && (
              <a
                href={project.live_demo || project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors text-sm border border-green-500/30"
              >
                <ExternalLink className="h-4 w-4" />
                Demo
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className={`group relative bg-gray-900/50 backdrop-blur-sm border rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 ${
      featured ? 'border-yellow-500/50 ring-1 ring-yellow-500/20' : 'border-gray-700/50'
    }`}>
      {/* Featured Badge */}
      {featured && (
        <div className="absolute -top-2 -right-2 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs border border-yellow-500/30">
          ⭐ Featured
        </div>
      )}

      {/* Project Icon */}
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-green-500/20 rounded-lg">
          <IconComponent className="h-6 w-6 text-green-400" />
        </div>
        <div className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
          {project.status}
        </div>
      </div>

      {/* Project Content */}
      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
        {project.title}
      </h3>
      
      <p className="text-gray-400 mb-4 leading-relaxed">
        {project.description}
      </p>

      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(project.technologies || project.tech || []).map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {(project.github_url || project.github) && (
          <a
            href={project.github_url || project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
          >
            <Github className="h-4 w-4" />
            Code
          </a>
        )}
        {(project.live_demo || project.link) && project.live_demo !== '#' && project.link !== '#' && (
          <a
            href={project.live_demo || project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors text-sm border border-green-500/30"
          >
            <ExternalLink className="h-4 w-4" />
            Demo
          </a>
        )}
      </div>
    </div>
  );
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentProject, setCurrentProject] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'visual'

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/data/projects.json');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.projects);
        setCategories(data.categories || {});
        setLoading(false);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status) => {
    const statusMap = {
      'active': 'text-green-400 border-green-500/30 bg-green-500/10',
      'completed': 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      'beta': 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
      'in_development': 'text-orange-400 border-orange-500/30 bg-orange-500/10',
      'archived': 'text-gray-400 border-gray-500/30 bg-gray-500/10'
    };
    return statusMap[status] || 'text-gray-400 border-gray-500/30 bg-gray-500/10';
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Infrastructure': '🏗️',
      'Security Tools': '🛡️', 
      'Research': '🔬',
      'Automation': '🤖',
      'Malware Analysis': '🦠',
      'Penetration Testing': '⚔️'
    };
    return iconMap[category] || '💻';
  };

  const openLightbox = (project, imageIndex = 0) => {
    if (project.screenshots && project.screenshots.length > 0) {
      setCurrentProject(project);
      setCurrentImageIndex(imageIndex);
      setCurrentImage(project.screenshots[imageIndex]);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage(null);
    setCurrentProject(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (currentProject && currentProject.screenshots) {
      const nextIndex = (currentImageIndex + 1) % currentProject.screenshots.length;
      setCurrentImageIndex(nextIndex);
      setCurrentImage(currentProject.screenshots[nextIndex]);
    }
  };

  const prevImage = () => {
    if (currentProject && currentProject.screenshots) {
      const prevIndex = (currentImageIndex - 1 + currentProject.screenshots.length) % currentProject.screenshots.length;
      setCurrentImageIndex(prevIndex);
      setCurrentImage(currentProject.screenshots[prevIndex]);
    }
  };

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  const featuredProjects = projects.filter(project => project.featured);

  const getProjectIcon = (title) => {
    if (title.includes('Monitoring')) return Activity;
    if (title.includes('Tools')) return Code;
    if (title.includes('Bot')) return Server;
    if (title.includes('proxy')) return Shield;
    return Code;
  };

  if (loading) {
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
            <p className="text-gray-400 font-mono"># Loading projects...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 relative" id="projects">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-4xl font-mono font-bold mb-4 text-red-400">
              ./projects --error
            </h2>
            <p className="text-red-400 font-mono"># {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 relative" id="projects">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            Projets
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            Portfolio de projets cybersécurité, infrastructure et outils d'automatisation
          </p>
        </div>

        {/* Controls */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-gray-800/50 text-gray-400 hover:text-green-400'
              }`}
            >
              📋 Grid View
            </button>
            <button
              onClick={() => setViewMode('visual')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'visual' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-gray-800/50 text-gray-400 hover:text-green-400'
              }`}
            >
              🖼️ Visual Mode
            </button>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800/50 text-green-400 border border-gray-600/50 rounded-lg px-4 py-2 focus:border-green-500/50 focus:outline-none"
          >
            <option value="all">All Categories ({projects.length})</option>
            {Object.entries(categories).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.icon} {key} ({projects.filter(p => p.category === key).length})
              </option>
            ))}
          </select>
        </div>

        {/* Featured Projects */}
        {selectedCategory === 'all' && featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8 text-yellow-400">⭐ Featured Projects</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onImageClick={openLightbox}
                  viewMode="grid"
                  featured={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Projects */}
        <div className={`grid gap-8 ${
          viewMode === 'visual' 
            ? 'md:grid-cols-1 lg:grid-cols-2' 
            : 'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onImageClick={openLightbox}
              viewMode={viewMode}
              featured={false}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-gray-400">No projects found in this category.</p>
          </div>
        )}

        {/* Lightbox Modal */}
        {lightboxOpen && currentImage && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="relative max-w-6xl max-h-full">
              {/* Navigation Buttons */}
              {currentProject?.screenshots?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-10 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image */}
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={currentImage.url}
                  alt={currentImage.alt}
                  className="max-w-full max-h-[80vh] object-contain mx-auto"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMUYyOTM3Ii8+CjxwYXRoIGQ9Ik0xNzUgMTMwSDE0NVYxNjBIMTc1VjEzMFoiIGZpbGw9IiM0QjU1NjMiLz4KPHA+dGggZD0iTTE5NSAxNzBIMjI1VjIwMEgxOTVWMTcwWiIgZmlsbD0iIzRCNTU2MyIvPgo8cGF0aCBkPSJNMTQ1IDE3MEgxNzVWMjAwSDE0NVYxNzBaIiBmaWxsPSIjNEI1NTYzIi8+CjwvZz4KPC9zdmc+';
                  }}
                />
                
                {/* Image Caption */}
                {currentImage.caption && (
                  <div className="p-4 bg-gray-800/90">
                    <p className="text-green-400 text-center">{currentImage.caption}</p>
                    <p className="text-gray-400 text-sm text-center mt-1">
                      {currentImageIndex + 1} of {currentProject?.screenshots?.length}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}