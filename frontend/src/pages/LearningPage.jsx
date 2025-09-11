import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LearningPage = () => {
  const navigate = useNavigate();
  const [learningData, setLearningData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');

  useEffect(() => {
    const loadLearningData = async () => {
      try {
        const response = await fetch('/data/learning.json');
        const data = await response.json();
        setLearningData(data);
      } catch (error) {
        console.error('Error loading learning data:', error);
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
      'completed': 'text-green-400 border-green-400 bg-green-900',
      'in-progress': 'text-yellow-400 border-yellow-400 bg-yellow-900',
      'planned': 'text-blue-400 border-blue-400 bg-blue-900',
      'active': 'text-green-400 border-green-400',
      'periodic': 'text-purple-400 border-purple-400'
    };
    return colors[status] || 'text-gray-400 border-gray-400 bg-gray-900';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'completed': '✅',
      'in-progress': '🕓',
      'planned': '📅',
      'active': '🟢',
      'periodic': '🔄'
    };
    return icons[status] || '❓';
  };

  const getRating = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Security': '🛡️',
      'Penetration Testing': '⚔️',
      'DevOps': '⚙️',
      'Malware Analysis': '🦠',
      'Threat Intelligence': '🔍',
      'Research': '📖',
      'Industry News': '📰',
      'Breaking News': '🚨',
      'Malware Research': '🔬',
      'Technical Deep Dives': '🔧',
      'True Crime Tech': '🕵️',
      'Daily Briefings': '📡'
    };
    return icons[category] || '📚';
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono">
      {/* Header */}
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
        
        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-700">
          <div className="flex space-x-8">
            {[
              { id: 'courses', label: 'Courses', icon: '🎓' },
              { id: 'platforms', label: 'Platforms', icon: '💻' },
              { id: 'blogs', label: 'Blogs', icon: '📖' },
              { id: 'podcasts', label: 'Podcasts', icon: '🎧' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 px-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-green-400 text-green-400' 
                    : 'text-gray-400 hover:text-green-400'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-purple-400">📚 PROFESSIONAL COURSES</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {learningData?.learning?.courses?.map((course) => (
                <div 
                  key={course.id}
                  className={`border-2 rounded-lg p-6 ${getStatusColor(course.status)} bg-opacity-20 transition-all duration-300 hover:bg-opacity-30`}
                >
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
                        <span className="text-gray-300">{new Date(course.completionDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    
                    {course.progress && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-yellow-400 font-semibold">Progress:</span>
                          <span className="text-gray-300">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-yellow-400 transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {course.rating && (
                      <div className="flex items-center space-x-2">
                        <span className="text-orange-400 font-semibold">Rating:</span>
                        <span className="text-orange-400">{getRating(course.rating)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platforms Tab */}
        {activeTab === 'platforms' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-blue-400">💻 TRAINING PLATFORMS</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {learningData?.learning?.platforms?.map((platform, index) => (
                <div 
                  key={index}
                  className={`border-2 rounded-lg p-6 ${getStatusColor(platform.usage)} bg-opacity-20 hover:bg-opacity-30 transition-all duration-300`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                      <p className="text-blue-400 font-semibold">{platform.type}</p>
                    </div>
                    <span className="text-2xl">{getStatusIcon(platform.usage)}</span>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{platform.description}</p>
                  
                  <div className="bg-gray-800 p-4 rounded">
                    <h4 className="text-green-400 font-bold mb-2">Progress Stats</h4>
                    <div className="space-y-1 text-sm">
                      {Object.entries(platform.progress).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                          <span className="text-green-400 font-mono">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Tab */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-cyan-400">📖 SECURITY BLOGS & RESEARCH</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {learningData?.learning?.blogs?.map((blog, index) => (
                <div 
                  key={index}
                  className="border border-cyan-400 rounded-lg p-6 bg-gray-900 bg-opacity-30 hover:bg-opacity-50 transition-all duration-300"
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <span className="text-2xl">{getCategoryIcon(blog.category)}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{blog.name}</h3>
                      <p className="text-cyan-400 text-sm">{blog.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{blog.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm font-mono">{blog.url}</span>
                    <button className="px-3 py-1 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-500 transition-colors">
                      Visit →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Podcasts Tab */}
        {activeTab === 'podcasts' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-orange-400">🎧 SECURITY PODCASTS</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {learningData?.learning?.podcasts?.map((podcast, index) => (
                <div 
                  key={index}
                  className="border border-orange-400 rounded-lg p-6 bg-gray-900 bg-opacity-30 hover:bg-opacity-50 transition-all duration-300"
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <span className="text-2xl">{getCategoryIcon(podcast.category)}</span>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">{podcast.name}</h3>
                      <p className="text-orange-400 text-sm">Host: {podcast.host}</p>
                      <p className="text-gray-400 text-sm">{podcast.category}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300">{podcast.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Statistics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 bg-opacity-50 border border-green-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {learningData?.learning?.courses?.filter(c => c.status === 'completed').length || 0}
            </div>
            <div className="text-gray-400 text-sm">Completed Courses</div>
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 border border-blue-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {learningData?.learning?.platforms?.filter(p => p.usage === 'active').length || 0}
            </div>
            <div className="text-gray-400 text-sm">Active Platforms</div>
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 border border-cyan-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {learningData?.learning?.blogs?.length || 0}
            </div>
            <div className="text-gray-400 text-sm">Blogs Followed</div>
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 border border-orange-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">
              {learningData?.learning?.podcasts?.length || 0}
            </div>
            <div className="text-gray-400 text-sm">Podcasts</div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="text-center py-8 border-t border-gray-700 mt-12">
          <p className="text-gray-500">
            [ Continuous learning is key to staying ahead of evolving threats ]
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearningPage;