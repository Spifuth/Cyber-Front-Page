import { useState, useMemo } from 'react';
import { PageLayout, PageHeader, PageContent, LoadingSpinner, SectionCard } from '../components/shared';
import { useDataFetch } from '../hooks';
import { getSkillLevelColorFull, getLevelProgress } from '../lib/utils';

/**
 * ExpertiseLegend - Skill level descriptions
 */
function ExpertiseLegend({ skillLevels }) {
  if (!skillLevels) return null;

  return (
    <div className="mb-8 bg-gray-900/50 p-6 rounded-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-purple-400">Expertise Levels</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(skillLevels).map(([level, description]) => {
          const colors = getSkillLevelColorFull(level);
          return (
            <div key={level} className={`border ${colors.border} p-3 rounded`}>
              <h4 className={`font-bold ${colors.text}`}>{level}</h4>
              <p className="text-gray-400 text-sm">{description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * TechCard - Individual technology card
 */
function TechCard({ tech }) {
  const colors = getSkillLevelColorFull(tech.level);
  const progress = getLevelProgress(tech.level);

  return (
    <div className="border border-gray-700 rounded-lg p-3 hover:border-green-600 transition-colors bg-gray-800/30">
      <div className="flex justify-between items-start mb-2 gap-2">
        <h3 className="text-base font-bold text-white leading-tight flex-1 min-w-0">
          {tech.name}
        </h3>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className={`px-2 py-1 text-xs rounded border ${colors.text} ${colors.border} whitespace-nowrap`}>
            {tech.level}
          </span>
          <span className="text-gray-400 text-xs whitespace-nowrap">
            {tech.years}yr{tech.years !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-3 leading-snug">{tech.description}</p>

      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${colors.bg}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * CategoryCard - Expandable category section
 */
function CategoryCard({ categoryKey, categoryData, isExpanded, onToggle }) {
  return (
    <div
      className={`border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-900/30 hover:border-green-400 transition-all duration-300 flex flex-col ${
        isExpanded ? 'border-green-400 ring-2 ring-green-400/20' : ''
      }`}
    >
      {/* Header */}
      <div
        className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 cursor-pointer hover:from-gray-700 hover:to-gray-800 transition-all flex-shrink-0"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <span className="text-2xl flex-shrink-0">{categoryData.icon}</span>
            <h2 className="text-lg md:text-xl font-bold text-green-400 truncate">
              {categoryData.category}
            </h2>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-gray-400 text-sm">
              {categoryData.technologies?.length || 0} tools
            </span>
            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={`transition-all duration-300 overflow-hidden flex-1 ${
          isExpanded ? 'max-h-none' : 'max-h-0'
        }`}
      >
        <div className="p-4 space-y-3 h-full overflow-y-auto">
          {categoryData.technologies?.map((tech, index) => (
            <TechCard key={index} tech={tech} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * StatCard - Statistics display card
 */
function StatCard({ value, label, borderColor = 'border-green-400', textColor = 'text-green-400' }) {
  return (
    <div className={`bg-gray-900/50 border ${borderColor} p-4 rounded-lg text-center`}>
      <div className={`text-3xl font-bold ${textColor} mb-2`}>{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

/**
 * StackPage - Technology stack display page
 */
export default function StackPage() {
  const { data, loading } = useDataFetch('stack', {
    defaultValue: { stack: {}, skillLevels: {} }
  });
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data?.stack) return { total: 0, categories: 0, expert: 0, avgYears: 0 };

    const allTechs = Object.values(data.stack).flatMap(cat => cat.technologies || []);
    const total = allTechs.length;
    const categories = Object.keys(data.stack).length;
    const expert = allTechs.filter(tech => tech.level === 'Expert').length;
    const avgYears = total > 0 
      ? Math.round(allTechs.reduce((sum, tech) => sum + tech.years, 0) / total) 
      : 0;

    return { total, categories, expert, avgYears };
  }, [data?.stack]);

  if (loading) {
    return <LoadingSpinner icon="⚡" message="Loading tech stack..." />;
  }

  const handleToggle = (key) => {
    setExpandedCategory(expandedCategory === key ? null : key);
  };

  return (
    <PageLayout>
      <PageHeader
        title="TECH STACK"
        subtitle="Technologies, Tools & Expertise Levels"
      />

      <PageContent>
        <ExpertiseLegend skillLevels={data?.skillLevels} />

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 auto-rows-fr">
          {data?.stack && Object.entries(data.stack).map(([key, categoryData]) => (
            <CategoryCard
              key={key}
              categoryKey={key}
              categoryData={categoryData}
              isExpanded={expandedCategory === key || expandedCategory === null}
              onToggle={() => handleToggle(key)}
            />
          ))}
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            value={stats.total} 
            label="Total Technologies" 
            borderColor="border-green-400" 
            textColor="text-green-400" 
          />
          <StatCard 
            value={stats.categories} 
            label="Categories" 
            borderColor="border-blue-400" 
            textColor="text-blue-400" 
          />
          <StatCard 
            value={stats.expert} 
            label="Expert Level" 
            borderColor="border-purple-400" 
            textColor="text-purple-400" 
          />
          <StatCard 
            value={stats.avgYears} 
            label="Avg. Years Exp." 
            borderColor="border-yellow-400" 
            textColor="text-yellow-400" 
          />
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-gray-700 mt-12">
          <p className="text-gray-500">
            Infrastructure ready for offline demos – all data served from local mocks when VITE_USE_MOCK=1.
          </p>
        </div>
      </PageContent>
    </PageLayout>
  );
}
