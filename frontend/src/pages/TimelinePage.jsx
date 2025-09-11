import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TimelinePage = () => {
  const navigate = useNavigate();
  const [timelineData, setTimelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadTimelineData = async () => {
      try {
        const response = await fetch('/data/timeline.json');
        const data = await response.json();
        setTimelineData(data);
      } catch (error) {
        console.error('Error loading timeline data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTimelineData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p>Loading timeline data...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredTimeline = timelineData?.timeline?.filter(item => 
    filter === 'all' || item.type === filter
  ) || [];

  const sortedTimeline = filteredTimeline.sort((a, b) => new Date(b.date) - new Date(a.date));

  const getTypeIcon = (type) => {
    const icons = {
      career: '💼',
      education: '🎓',
      project: '🚀', 
      training: '📚'
    };
    return icons[type] || '📌';
  };

  const getTypeColor = (type) => {
    const colors = {
      career: 'text-green-400 border-green-400',
      education: 'text-blue-400 border-blue-400',
      project: 'text-purple-400 border-purple-400',
      training: 'text-yellow-400 border-yellow-400'
    };
    return colors[type] || 'text-gray-400 border-gray-400';
  };

  const getStatusColor = (status) => {
    const colors = {
      current: 'bg-green-500',
      completed: 'bg-blue-500', 
      ongoing: 'bg-orange-500',
      scheduled: 'bg-purple-500'
    };
    return colors[status] || 'bg-gray-500';
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
          <h1 className="text-4xl font-bold mb-2 text-green-400">► CAREER TIMELINE</h1>
          <p className="text-gray-400">Professional Journey & Milestones</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        
        {/* Filter Controls */}
        <div className="mb-8 text-center">
          <div className="flex justify-center space-x-4 flex-wrap">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded transition-colors ${
                filter === 'all' 
                  ? 'bg-green-400 text-black' 
                  : 'bg-gray-800 text-green-400 hover:bg-gray-700'
              }`}
            >
              All Events ({timelineData?.timeline?.length || 0})
            </button>
            {timelineData?.categories && Object.entries(timelineData.categories).map(([type, label]) => {
              const count = timelineData.timeline.filter(item => item.type === type).length;
              return (
                <button 
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded transition-colors ${
                    filter === type 
                      ? 'bg-green-400 text-black' 
                      : 'bg-gray-800 text-green-400 hover:bg-gray-700'
                  }`}
                >
                  {getTypeIcon(type)} {label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 w-0.5 h-full bg-gradient-to-b from-green-400 via-blue-400 to-purple-400"></div>
          
          <div className="space-y-8">
            {sortedTimeline.map((item, index) => (
              <div key={item.id} className="relative flex items-start">
                {/* Timeline Dot */}
                <div className={`absolute left-6 w-4 h-4 rounded-full border-2 bg-black ${getTypeColor(item.type)}`}>
                </div>
                
                {/* Status Indicator */}
                <div className={`absolute left-5 w-6 h-6 rounded-full ${getStatusColor(item.status)} opacity-20`}>
                </div>
                
                {/* Content Card */}
                <div className={`ml-16 border-l-4 ${getTypeColor(item.type)} pl-6 py-4 bg-gray-900 bg-opacity-50 rounded-r-lg w-full`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className={`text-xl font-bold ${getTypeColor(item.type)}`}>
                        {getTypeIcon(item.type)} {item.title}
                      </h3>
                      <p className="text-purple-400 font-semibold">{item.organization}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(item.status)} text-white`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {item.technologies && (
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 bg-gray-800 text-green-300 text-xs rounded border border-green-600"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {timelineData?.categories && Object.entries(timelineData.categories).map(([type, label]) => {
            const count = timelineData.timeline.filter(item => item.type === type).length;
            return (
              <div key={type} className={`border ${getTypeColor(type)} p-4 rounded-lg bg-gray-900 bg-opacity-50`}>
                <div className="text-2xl mb-2">{getTypeIcon(type)}</div>
                <div className="text-2xl font-bold text-green-400">{count}</div>
                <div className="text-sm text-gray-400">{label}</div>
              </div>
            );
          })}
        </div>

        {/* Terminal Footer */}
        <div className="text-center py-8 border-t border-gray-700 mt-12">
          <p className="text-gray-500">
            [ Run <span className="text-green-400">timeline</span> command in terminal for condensed view ]
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;