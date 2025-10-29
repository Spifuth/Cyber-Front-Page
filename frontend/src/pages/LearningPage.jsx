import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCollection } from '../lib/dataClient';
import { getEnvVar, isMockEnabled } from '../lib/env';

const LearningPage = () => {
  const navigate = useNavigate();
  const [learningData, setLearningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    const loadLearningData = async () => {
      try {
        const data = await loadCollection('learning');
        setLearningData(data);
      } catch (error) {
        console.error('Error loading learning data:', error);
        setLearningData({ learning: {} });
      } finally {
        setLoading(false);
      }
    };

    loadLearningData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">📚</div>
            <p>Loading learning resources...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      completed: 'text-green-400 border-green-400 bg-green-900',
      'in-progress': 'text-yellow-400 border-yellow-400 bg-yellow-900',
      planned: 'text-blue-400 border-blue-400 bg-blue-900',
      active: 'text-green-400 border-green-400',
      periodic: 'text-purple-400 border-purple-400'
    };
    return colors[status] || 'text-gray-400 border-gray-400 bg-gray-900';
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: '✅',
      'in-progress': '🕓',
      planned: '📅',
      active: '🟢',
      periodic: '🔄'
    };
    return icons[status] || '❓';
  };

  const getRating = (rating) => '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

  const getCategoryIcon = (category) => {
    const icons = {
      Security: '🛡️',
      'Penetration Testing': '⚔️',
      DevOps: '⚙️',
      'Malware Analysis': '🦠',
      'Threat Intelligence': '🔍',
      Research: '📖',
      'Industry News': '📰',
      'Breaking News': '🚨',
      'Malware Research': '🔬',
      'Technical Deep Dives': '🔧',
      'True Crime Tech': '🕵️',
      'Daily Briefings': '📡'
    };
    return icons[category] || '📚';
  };

  const resolveUrl = (url) => {
    if (!url) return '#';
    if (isMockEnabled()) {
      const fallback = getEnvVar('VITE_LEARNING_FALLBACK', '#');
      return fallback || '#';
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      <div className="bg-gradient-to-r from-gray-900 to-black border-b-2 border-green-400 p-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 px-4 py-2 bg-green-400 text-black hover:bg-green-300 transition-colors rounded"
        >
          ← Back to Terminal
        </button>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-green-400">► LEARNING RESOURCES</h1>
          <p className="text-gray-400">Continuous Education & Professional Development</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8 border-b border-gray-700">
          <div className="flex space-x-8">
            {[
              { id: 'courses', label: 'Courses', icon: '🎓' },
              { id: 'platforms', label: 'Platforms', icon: '💻' },
              { id: 'blogs', label: 'Blogs', icon: '📖' },
              { id: 'podcasts', label: 'Podcasts', icon: '🎧' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 transition-colors ${
                  activeTab === tab.id ? 'border-b-2 border-green-400 text-green-400' : 'text-gray-400 hover:text-green-400'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-400">📚 PROFESSIONAL COURSES</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {learningData?.learning?.courses?.map((course) => (
                <div key={course.id} className={`border-2 rounded-lg p-6 ${getStatusColor(course.status)} bg-opacity-20 transition-all duration-300 hover:bg-opacity-30`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                      <p className="text-purple-400 font-semibold">{course.provider}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl">{getStatusIcon(course.status)}</span>
                      <p className="text-sm text-gray-400">{course.status.replace('-', ' ').toUpperCase()}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4">{course.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-blue-400 font-semibold">Category:</span>
                      <span className="text-gray-300 flex items-center space-x-1">
                        <span>{getCategoryIcon(course.category)}</span>
                        <span>{course.category}</span>
                      </span>
                    </div>

                    {course.completionDate && (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 font-semibold">Completed:</span>
                        <span className="text-gray-300">{course.completionDate}</span>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400 font-semibold">Difficulty:</span>
                      <span className="text-gray-300">{course.difficulty}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-red-400 font-semibold">Rating:</span>
                      <span className="text-gray-300">{getRating(course.rating)}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 font-semibold">Hours:</span>
                      <span className="text-gray-300">{course.hours}h</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-xs text-gray-500">Last update: {course.lastUpdated}</div>
                    {course.url && (
                      <a
                        href={resolveUrl(course.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-2 text-sm border border-green-400 text-green-400 rounded hover:bg-green-500/20 transition-colors"
                      >
                        Access Course
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'platforms' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-400">💻 PLATFORMS</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {learningData?.learning?.platforms?.map((platform) => (
                <div key={platform.id} className="border border-blue-500/30 rounded-lg p-6 bg-gray-900/60 hover:border-blue-400 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                      <p className="text-gray-400 text-sm">{platform.description}</p>
                    </div>
                    <span className="text-blue-400 text-2xl">{getCategoryIcon(platform.category)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div>
                      <span className="text-blue-400">Focus:</span> {platform.focus}
                    </div>
                    <div>
                      <span className="text-yellow-400">Format:</span> {platform.format}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                    {platform.keyFeatures.map((feature) => (
                      <span key={feature} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <a
                      href={resolveUrl(platform.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 text-sm border border-blue-400 text-blue-400 rounded hover:bg-blue-500/20 transition-colors"
                    >
                      Visit Platform
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-red-400">📖 BLOGS & NEWS</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {learningData?.learning?.blogs?.map((blog) => (
                <div key={blog.id} className="border border-red-500/30 rounded-lg p-6 bg-gray-900/60 hover:border-red-400 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{blog.name}</h3>
                      <p className="text-gray-400 text-sm">{blog.description}</p>
                    </div>
                    <span className="text-red-400 text-2xl">{getCategoryIcon(blog.category)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div>
                      <span className="text-red-400">Frequency:</span> {blog.frequency}
                    </div>
                    <div>
                      <span className="text-yellow-400">Focus:</span> {blog.focus}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                    {blog.keyTopics.map((topic) => (
                      <span key={topic} className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <a
                      href={resolveUrl(blog.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 text-sm border border-red-400 text-red-400 rounded hover:bg-red-500/20 transition-colors"
                    >
                      Read Blog
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'podcasts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-yellow-400">🎧 PODCASTS & AUDIO</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {learningData?.learning?.podcasts?.map((podcast) => (
                <div key={podcast.id} className="border border-yellow-500/30 rounded-lg p-6 bg-gray-900/60 hover:border-yellow-400 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{podcast.name}</h3>
                      <p className="text-gray-400 text-sm">{podcast.description}</p>
                    </div>
                    <span className="text-yellow-400 text-2xl">{getCategoryIcon(podcast.category)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <div>
                      <span className="text-yellow-400">Frequency:</span> {podcast.frequency}
                    </div>
                    <div>
                      <span className="text-blue-400">Format:</span> {podcast.format}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                    {podcast.keyTopics.map((topic) => (
                      <span key={topic} className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-end">
                    <a
                      href={resolveUrl(podcast.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 text-sm border border-yellow-400 text-yellow-400 rounded hover:bg-yellow-500/20 transition-colors"
                    >
                      Listen Now
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningPage;
