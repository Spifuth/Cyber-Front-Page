import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadCollection } from '../lib/dataClient';
import { getSkillLevelColor } from '../lib/utils';

const SkillsPage = () => {
  const navigate = useNavigate();
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('technical');

  useEffect(() => {
    const loadSkillsData = async () => {
      try {
        const data = await loadCollection('skills');
        setSkillsData(data);
      } catch (error) {
        console.error('Error loading skills data:', error);
        setSkillsData({ skills: {} });
      } finally {
        setLoading(false);
      }
    };

    loadSkillsData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🛠️</div>
            <p>Loading skill matrix...</p>
          </div>
        </div>
      </div>
    );
  }

  const categories = skillsData?.skills || {};
  const categoryKeys = Object.keys(categories);

  const activeSkills = categories[selectedCategory] || [];

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
          <h1 className="text-4xl font-bold mb-2 text-green-400">► SKILLS MATRIX</h1>
          <p className="text-gray-400">Technical & Soft Skills Overview</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            <div className="bg-gray-900/60 border border-green-400 rounded-lg p-4">
              <h3 className="text-lg font-bold text-green-400 mb-3">Categories</h3>
              <div className="space-y-2">
                {categoryKeys.map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`w-full text-left px-3 py-2 rounded transition-colors ${
                      selectedCategory === key ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {key.replace('-', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/60 border border-blue-400 rounded-lg p-4 text-sm text-gray-300">
              <h3 className="text-lg font-bold text-blue-400 mb-3">Legend</h3>
              <div className="space-y-2">
                {['Expert', 'Advanced', 'Intermediate', 'Beginner'].map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <span className={`w-3 h-3 rounded-full ${getSkillLevelColor(level)}`}></span>
                    <span>{level}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="bg-gray-900/60 border border-green-400 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-4">
                {selectedCategory.replace('-', ' ').toUpperCase()}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {activeSkills.map((skill) => (
                  <div key={skill.name} className="bg-gray-800/70 border border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-white">{skill.name}</h4>
                        <p className="text-gray-400 text-sm">{skill.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${getSkillLevelColor(skill.level)} text-black`}>{skill.level}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                      {skill.tools?.map((tool) => (
                        <span key={tool} className="px-2 py-1 bg-gray-700 rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
