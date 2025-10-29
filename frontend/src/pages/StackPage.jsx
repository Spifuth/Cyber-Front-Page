import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCollection } from '../lib/dataClient';

const StackPage = () => {
  const navigate = useNavigate();
  const [stackData, setStackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const loadStackData = async () => {
      try {
        const data = await loadCollection('stack');
        setStackData(data);
      } catch (error) {
        console.error('Error loading stack data:', error);
        setStackData({ stack: {}, skillLevels: {} });
      } finally {
        setLoading(false);
      }
    };

    loadStackData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">⚡</div>
            <p>Loading tech stack...</p>
          </div>
        </div>
      </div>
    );
  }

  const getLevelColor = (level) => {
    const colors = {
      Expert: 'text-green-400 border-green-400 bg-green-400',
      Advanced: 'text-blue-400 border-blue-400 bg-blue-400',
      Intermediate: 'text-yellow-400 border-yellow-400 bg-yellow-400',
      Beginner: 'text-gray-400 border-gray-400 bg-gray-400'
    };
    return colors[level] || 'text-gray-400 border-gray-400 bg-gray-400';
  };

  const getLevelProgress = (level) => {
    const progress = { Expert: 100, Advanced: 80, Intermediate: 60, Beginner: 30 };
    return progress[level] || 0;
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
          <h1 className="text-4xl font-bold mb-2 text-green-400">► TECH STACK</h1>
          <p className="text-gray-400">Technologies, Tools & Expertise Levels</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="mb-8 bg-gray-900 bg-opacity-50 p-6 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-purple-400">Expertise Levels</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stackData?.skillLevels &&
              Object.entries(stackData.skillLevels).map(([level, description]) => (
                <div key={level} className={`border ${getLevelColor(level)} p-3 rounded`}>
                  <h4 className={`font-bold ${getLevelColor(level)}`}>{level}</h4>
                  <p className="text-gray-400 text-sm">{description}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
          {stackData?.stack &&
            Object.entries(stackData.stack).map(([categoryKey, categoryData]) => (
              <div
                key={categoryKey}
                className={`border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-900 bg-opacity-30 hover:border-green-400 transition-all duration-300 flex flex-col ${
                  selectedCategory === categoryKey ? 'border-green-400 ring-2 ring-green-400/20' : ''
                }`}
              >
                <div
                  className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 cursor-pointer hover:from-gray-700 hover:to-gray-800 transition-all flex-shrink-0"
                  onClick={() => setSelectedCategory(selectedCategory === categoryKey ? null : categoryKey)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="text-2xl flex-shrink-0">{categoryData.icon}</span>
                      <h2 className="text-lg md:text-xl font-bold text-green-400 truncate">{categoryData.category}</h2>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-gray-400 text-sm">{categoryData.technologies?.length || 0} tools</span>
                      <span className={`transform transition-transform ${selectedCategory === categoryKey ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className={`transition-all duration-300 overflow-hidden flex-1 ${
                    selectedCategory === categoryKey || selectedCategory === null ? 'max-h-none' : 'max-h-0'
                  }`}
                >
                  <div className="p-4 space-y-3 h-full overflow-y-auto">
                    {categoryData.technologies?.map((tech, index) => (
                      <div key={index} className="border border-gray-700 rounded-lg p-3 hover:border-green-600 transition-colors bg-gray-800/30">
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <h3 className="text-base font-bold text-white leading-tight flex-1 min-w-0">{tech.name}</h3>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <span className={`px-2 py-1 text-xs rounded border ${getLevelColor(tech.level)} whitespace-nowrap`}>
                              {tech.level}
                            </span>
                            <span className="text-gray-400 text-xs whitespace-nowrap">{tech.years}yr{tech.years !== 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <p className="text-gray-400 text-sm mb-3 leading-snug">{tech.description}</p>

                        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${getLevelColor(tech.level).split(' ')[2] || 'bg-green-400'}`}
                            style={{ width: `${getLevelProgress(tech.level)}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 bg-opacity-50 border border-green-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {stackData?.stack
                ? Object.values(stackData.stack).reduce((total, cat) => total + (cat.technologies?.length || 0), 0)
                : 0}
            </div>
            <div className="text-gray-400 text-sm">Total Technologies</div>
          </div>

          <div className="bg-gray-900 bg-opacity-50 border border-blue-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{stackData?.stack ? Object.keys(stackData.stack).length : 0}</div>
            <div className="text-gray-400 text-sm">Categories</div>
          </div>

          <div className="bg-gray-900 bg-opacity-50 border border-purple-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {stackData?.stack
                ? Object.values(stackData.stack)
                    .flatMap((cat) => cat.technologies || [])
                    .filter((tech) => tech.level === 'Expert').length
                : 0}
            </div>
            <div className="text-gray-400 text-sm">Expert Level</div>
          </div>

          <div className="bg-gray-900 bg-opacity-50 border border-yellow-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {stackData?.stack
                ? Math.round(
                    Object.values(stackData.stack)
                      .flatMap((cat) => cat.technologies || [])
                      .reduce((sum, tech) => sum + tech.years, 0) /
                      Object.values(stackData.stack).flatMap((cat) => cat.technologies || []).length
                  )
                : 0}
            </div>
            <div className="text-gray-400 text-sm">Avg. Years Exp.</div>
          </div>
        </div>

        <div className="text-center py-8 border-t border-gray-700 mt-12">
          <p className="text-gray-500">
            Infrastructure ready for offline demos – all data served from local mocks when VITE_USE_MOCK=1.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StackPage;
