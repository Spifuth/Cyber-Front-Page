import { useState, useEffect } from 'react';
import { ExternalLink, Github, X, ChevronLeft, ChevronRight, Activity, Code, Server, Shield } from 'lucide-react';
import { loadCollection } from '../lib/dataClient';
import { isMockEnabled } from '../lib/env';
import { getStatusColor } from '../lib/utils';

const ProjectCard = ({ project, featured }) => {
  const getProjectIcon = (title) => {
    if (title.includes('Monitoring')) return Activity;
    if (title.includes('Tools')) return Code;
    if (title.includes('Bot')) return Server;
    if (title.includes('proxy')) return Shield;
    return Code;
  };

  const IconComponent = getProjectIcon(project.title);
  const hasGithub = Boolean(project.github_url || project.github);
  const offline = isMockEnabled();
  const hasDemo = !offline && Boolean(project.live_demo || project.link);
  const demoUrl = offline ? '#' : project.live_demo || project.link || '#';

  return (
    <div
      className={`group relative bg-gray-900/50 backdrop-blur-sm border rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 ${
        featured ? 'border-yellow-500/50 ring-1 ring-yellow-500/20' : 'border-gray-700/50'
      }`}
    >
      {featured && (
        <div className="absolute -top-2 -right-2 bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs border border-yellow-500/30">
          ⭐ Featured
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-green-500/20 rounded-lg">
          <IconComponent className="h-6 w-6 text-green-400" />
        </div>
        <div className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(project.status)}`}>
          {project.status}
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-green-400 transition-colors">
        {project.title}
      </h3>

      <p className="text-gray-400 mb-4 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {(project.technologies || project.tech || []).map((tech, index) => (
          <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded border border-blue-500/30">
            {tech}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        {hasGithub && (
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
        {hasDemo && demoUrl !== '#' && (
          <a
            href={demoUrl}
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

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await loadCollection('projects');
        setProjects(data.projects || []);
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

  const getCategoryIcon = (category) => {
    const iconMap = {
      Infrastructure: '🏗️',
      'Security Tools': '🛡️',
      Research: '🔬',
      Automation: '🤖',
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

  const filteredProjects = selectedCategory === 'all' ? projects : projects.filter((project) => project.category === selectedCategory);
  const featuredProjects = projects.filter((project) => project.featured);

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
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent mx-auto"></div>
          </div>
          <p className="text-center text-gray-400">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 px-4 relative" id="projects">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-mono font-bold mb-4 text-green-400">./projects</h2>
          <p className="text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 relative" id="projects">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-mono font-bold mb-4 text-green-400">
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              ./projects
            </span>
          </h2>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent mx-auto"></div>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Sélection de projets cyber & infra, construits pour l'auto-hébergement, la détection d'intrusions et l'automatisation des flux de sécurité.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full border ${selectedCategory === 'all' ? 'border-green-400 bg-green-500/20 text-green-200' : 'border-gray-700 text-gray-400 hover:border-green-400/40 hover:text-green-200'}`}
          >
            All
          </button>
          {Object.entries(categories).map(([category, info]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === category
                  ? 'border-green-400 bg-green-500/20 text-green-200'
                  : 'border-gray-700 text-gray-400 hover:border-green-400/40 hover:text-green-200'
              }`}
            >
              {getCategoryIcon(category)} {category}
              {info?.count ? <span className="ml-2 text-sm text-green-400">({info.count})</span> : null}
            </button>
          ))}
        </div>

        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-mono text-yellow-400 mb-6">► Featured Operations</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} featured />
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {lightboxOpen && currentImage && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-4">
            <div className="flex justify-between w-full max-w-5xl mb-4 text-white">
              <button onClick={closeLightbox} className="p-2 hover:text-red-400 transition-colors" aria-label="Close screenshot">
                <X className="h-6 w-6" />
              </button>
              <div className="text-center">
                <h3 className="text-lg font-semibold">{currentProject?.title}</h3>
                <p className="text-sm text-gray-400">{currentImage?.caption}</p>
              </div>
              <div className="w-10"></div>
            </div>

            <div className="relative w-full max-w-5xl">
              <img src={currentImage?.url} alt={currentImage?.alt} className="w-full h-auto rounded-lg border border-green-500/20" />
              {currentProject?.screenshots?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition"
                    aria-label="Previous screenshot"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-3 rounded-full text-white hover:bg-black/70 transition"
                    aria-label="Next screenshot"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
