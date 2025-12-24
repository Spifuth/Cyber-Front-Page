import { useState } from 'react';
import { PageLayout, PageHeader, PageContent, LoadingSpinner, SectionCard } from '../components/shared';
import { useDataFetch } from '../hooks';
import { getSkillLevelColor } from '../lib/utils';

/**
 * CategorySidebar - Skill category navigation
 */
function CategorySidebar({ categories, selected, onSelect }) {
  const categoryKeys = Object.keys(categories);

  return (
    <div className="md:col-span-1 space-y-4">
      <SectionCard borderColor="border-green-400">
        <h3 className="text-lg font-bold text-green-400 mb-3">Categories</h3>
        <div className="space-y-2">
          {categoryKeys.map((key) => (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                selected === key 
                  ? 'bg-green-500 text-black' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {key.replace(/-/g, ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </SectionCard>

      <LegendCard />
    </div>
  );
}

/**
 * LegendCard - Skill level legend
 */
function LegendCard() {
  const levels = ['Expert', 'Advanced', 'Intermediate', 'Beginner'];

  return (
    <SectionCard borderColor="border-blue-400" className="text-sm text-gray-300">
      <h3 className="text-lg font-bold text-blue-400 mb-3">Legend</h3>
      <div className="space-y-2">
        {levels.map((level) => (
          <div key={level} className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full ${getSkillLevelColor(level)}`} />
            <span>{level}</span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

/**
 * SkillCard - Individual skill display
 */
function SkillCard({ skill }) {
  return (
    <div className="bg-gray-800/70 border border-gray-700 rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-bold text-white">{skill.name}</h4>
          <p className="text-gray-400 text-sm">{skill.description}</p>
        </div>
        <span className={`px-2 py-1 text-xs rounded ${getSkillLevelColor(skill.level)} text-black`}>
          {skill.level}
        </span>
      </div>
      {skill.tools && skill.tools.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs text-gray-300">
          {skill.tools.map((tool) => (
            <span key={tool} className="px-2 py-1 bg-gray-700 rounded">
              {tool}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * SkillsPage - Skills matrix page
 */
export default function SkillsPage() {
  const { data, loading } = useDataFetch('skills', { 
    defaultValue: { skills: {} } 
  });
  const [selectedCategory, setSelectedCategory] = useState('technical');

  if (loading) {
    return <LoadingSpinner icon="🛠️" message="Loading skill matrix..." />;
  }

  const categories = data?.skills || {};
  const activeSkills = categories[selectedCategory] || [];

  return (
    <PageLayout>
      <PageHeader
        title="SKILLS MATRIX"
        subtitle="Technical & Soft Skills Overview"
      />

      <PageContent>
        <div className="grid md:grid-cols-4 gap-6">
          <CategorySidebar
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <div className="md:col-span-3">
            <SectionCard borderColor="border-green-400">
              <h3 className="text-2xl font-bold text-green-400 mb-4">
                {selectedCategory.replace(/-/g, ' ').toUpperCase()}
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {activeSkills.map((skill) => (
                  <SkillCard key={skill.name} skill={skill} />
                ))}
              </div>
              {activeSkills.length === 0 && (
                <p className="text-gray-400 text-center py-8">
                  No skills found in this category.
                </p>
              )}
            </SectionCard>
          </div>
        </div>
      </PageContent>
    </PageLayout>
  );
}
