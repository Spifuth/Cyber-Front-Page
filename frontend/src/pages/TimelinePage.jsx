import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCollection } from '../lib/dataClient';

const TimelinePage = () => {
  const navigate = useNavigate();
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const data = await loadCollection('timeline');
        setTimelineData(data.timeline || []);
      } catch (error) {
        console.error('Error loading timeline data:', error);
        setTimelineData([]);
      } finally {
        setLoading(false);
      }
    };

    loadTimeline();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p>Loading timeline...</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredTimeline = filter === 'all' ? timelineData : timelineData.filter((item) => item.type === filter);

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
          <h1 className="text-4xl font-bold mb-2 text-green-400">► CAREER TIMELINE</h1>
          <p className="text-gray-400">Professional milestones & achievements</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {['all', 'career', 'education', 'certification', 'achievement'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded border transition-colors ${
                filter === type
                  ? 'border-green-400 bg-green-500/20 text-green-200'
                  : 'border-gray-700 text-gray-400 hover:border-green-400/40 hover:text-green-200'
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative border-l-2 border-green-400 pl-8 space-y-6">
          {filteredTimeline.map((event) => (
            <div key={event.id} className="relative">
              <div className="absolute -left-[11px] top-2 w-5 h-5 rounded-full border-2 border-green-400 bg-black"></div>
              <div className="bg-gray-900/70 border border-green-400/20 rounded-lg p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-green-400">{event.title}</h3>
                    <p className="text-gray-400 text-sm">{event.organization}</p>
                  </div>
                  <span className="text-blue-400 text-sm">{new Date(event.date).toLocaleDateString()}</span>
                </div>

                <p className="text-gray-300 mb-3">{event.description}</p>

                <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                  {event.technologies?.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
