import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SkillsPage = () => {
  const navigate = useNavigate();
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('radar'); // 'radar' or 'grid'
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadSkillsData = async () => {
      try {
        const response = await fetch('/data/skills.json');
        const data = await response.json();
        setSkillsData(data);
      } catch (error) {
        console.error('Error loading skills data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSkillsData();
  }, []);

  // Draw radar chart
  useEffect(() => {
    if (!skillsData || !canvasRef.current || viewMode !== 'radar') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 40;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const skills = skillsData.skills.technical.filter(skill => 
      selectedCategory === 'all' || skill.category === selectedCategory
    ).slice(0, 12); // Limit to 12 skills for readability

    if (skills.length === 0) return;

    const angleStep = (2 * Math.PI) / skills.length;

    // Draw background grid
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.lineWidth = 1;

    for (let i = 1; i <= 5; i++) {
      const radius = (maxRadius / 5) * i;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    // Draw axis lines
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
    for (let i = 0; i < skills.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * maxRadius;
      const y = centerY + Math.sin(angle) * maxRadius;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // Draw skill polygon
    ctx.strokeStyle = '#00ff41';
    ctx.fillStyle = 'rgba(0, 255, 65, 0.1)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const skillRadius = (skill.level / 10) * maxRadius;
      const x = centerX + Math.cos(angle) * skillRadius;
      const y = centerY + Math.sin(angle) * skillRadius;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw skill points and labels
    ctx.fillStyle = '#00ff41';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    skills.forEach((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const skillRadius = (skill.level / 10) * maxRadius;
      const x = centerX + Math.cos(angle) * skillRadius;
      const y = centerY + Math.sin(angle) * skillRadius;
      
      // Draw skill point
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Draw skill label
      const labelRadius = maxRadius + 20;
      const labelX = centerX + Math.cos(angle) * labelRadius;
      const labelY = centerY + Math.sin(angle) * labelRadius;
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(skill.name.split(' ')[0], labelX, labelY);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(`${skill.level}/10`, labelX, labelY + 12);
      ctx.fillStyle = '#00ff41';
    });

  }, [skillsData, selectedCategory, viewMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🎯</div>
            <p>Analyzing skill matrix...</p>
          </div>
        </div>
      </div>
    );
  }

  const categories = ['all', ...Object.keys(skillsData?.skills?.categories || {})];
  const filteredSkills = selectedCategory === 'all' 
    ? skillsData?.skills?.technical || []
    : skillsData?.skills?.technical?.filter(skill => skill.category === selectedCategory) || [];

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
          <h1 className="text-4xl font-bold mb-2 text-green-400">► SKILLS MATRIX</h1>
          <p className="text-gray-400">Technical Expertise & Competency Analysis</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        
        {/* Controls */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('radar')}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === 'radar' 
                  ? 'bg-green-400 text-black' 
                  : 'bg-gray-800 text-green-400 hover:bg-gray-700'
              }`}
            >
              🎯 Radar Chart
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-green-400 text-black' 
                  : 'bg-gray-800 text-green-400 hover:bg-gray-700'
              }`}
            >
              📊 Grid View
            </button>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-800 text-green-400 border border-green-500/50 rounded px-4 py-2 focus:border-green-400 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {Object.entries(skillsData?.skills?.categories || {}).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.icon} {key}
              </option>
            ))}
          </select>
        </div>

        {/* Radar Chart View */}
        {viewMode === 'radar' && (
          <div className="mb-8 flex justify-center">
            <div className="border border-green-500/50 rounded-lg bg-gray-900 bg-opacity-30 p-6">
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                className="max-w-full h-auto"
              />
            </div>
          </div>
        )}

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredSkills.map((skill, index) => (
              <div 
                key={skill.name}
                className="border border-green-500/30 rounded-lg p-4 bg-gray-900 bg-opacity-30 hover:border-green-400 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-white">{skill.name}</h3>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-400">{skill.level}</span>
                    <span className="text-gray-400 text-sm">/10</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Level</span>
                    <span className="text-blue-400">{skill.level * 10}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${skill.level * 10}%`,
                        backgroundColor: skill.color || '#00ff41'
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Category:</span>
                    <span className="text-purple-400">{skill.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-yellow-400">{skill.experience_years}yr{skill.experience_years !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Soft Skills */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-400">► SOFT SKILLS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillsData?.skills?.soft_skills?.map((skill) => (
              <div key={skill.name} className="flex items-center justify-between p-3 border border-purple-400/30 rounded bg-gray-900 bg-opacity-20">
                <span className="text-white">{skill.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${skill.level * 10}%`,
                        backgroundColor: skill.color
                      }}
                    ></div>
                  </div>
                  <span className="text-purple-400 text-sm w-8">{skill.level}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 bg-opacity-50 border border-green-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {skillsData?.skills?.technical?.length || 0}
            </div>
            <div className="text-gray-400 text-sm">Technical Skills</div>
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 border border-purple-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {skillsData?.skills?.soft_skills?.length || 0}
            </div>
            <div className="text-gray-400 text-sm">Soft Skills</div>
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 border border-blue-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {skillsData?.skills?.technical?.filter(skill => skill.level >= 8).length || 0}
            </div>
            <div className="text-gray-400 text-sm">Expert Level</div>
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 border border-yellow-400 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {skillsData?.skills?.technical ? 
                Math.round(skillsData.skills.technical.reduce((sum, skill) => sum + skill.experience_years, 0) / skillsData.skills.technical.length)
                : 0}
            </div>
            <div className="text-gray-400 text-sm">Avg. Years Exp.</div>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="text-center py-8 border-t border-gray-700">
          <p className="text-gray-500">
            [ Run <span className="text-green-400">skills</span> command in terminal for quick overview ]
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;