import { useState } from 'react';
import { PageLayout, PageHeader, PageContent, LoadingSpinner, SectionCard } from '../components/shared';
import { useDataFetch } from '../hooks';
import { getEnvVar, isMockEnabled } from '../lib/env';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const STATUS_CONFIG = {
  completed: { color: 'text-green-400 border-green-400 bg-green-900', icon: '✅' },
  'in-progress': { color: 'text-yellow-400 border-yellow-400 bg-yellow-900', icon: '🕓' },
  planned: { color: 'text-blue-400 border-blue-400 bg-blue-900', icon: '📅' },
  active: { color: 'text-green-400 border-green-400', icon: '🟢' },
  periodic: { color: 'text-purple-400 border-purple-400', icon: '🔄' }
};

const CATEGORY_ICONS = {
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

const getStatusColor = (status) => STATUS_CONFIG[status]?.color || 'text-gray-400 border-gray-400 bg-gray-900';
const getStatusIcon = (status) => STATUS_CONFIG[status]?.icon || '❓';
const getCategoryIcon = (category) => CATEGORY_ICONS[category] || '📚';
const getRating = (rating) => '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

const resolveUrl = (url) => {
  if (!url) return '#';
  if (isMockEnabled()) {
    return getEnvVar('VITE_LEARNING_FALLBACK', '#') || '#';
  }
  return url;
};

// ============================================================================
// TAB DEFINITIONS
// ============================================================================

const TABS = [
  { id: 'courses', label: 'Courses', icon: '🎓' },
  { id: 'platforms', label: 'Platforms', icon: '💻' },
  { id: 'blogs', label: 'Blogs', icon: '📖' },
  { id: 'podcasts', label: 'Podcasts', icon: '🎧' }
];

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * TabBar - Navigation tabs
 */
function TabBar({ activeTab, onTabChange }) {
  return (
    <div className="mb-8 border-b border-gray-700">
      <div className="flex space-x-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
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
  );
}

/**
 * ExternalLink - Consistent link button styling
 */
function ExternalLink({ href, color = 'green', children }) {
  const colorClasses = {
    green: 'border-green-400 text-green-400 hover:bg-green-500/20',
    blue: 'border-blue-400 text-blue-400 hover:bg-blue-500/20',
    red: 'border-red-400 text-red-400 hover:bg-red-500/20',
    yellow: 'border-yellow-400 text-yellow-400 hover:bg-yellow-500/20'
  };

  return (
    <a
      href={resolveUrl(href)}
      target="_blank"
      rel="noopener noreferrer"
      className={`px-3 py-2 text-sm border rounded transition-colors ${colorClasses[color]}`}
    >
      {children}
    </a>
  );
}

/**
 * TagList - List of tags/features
 */
function TagList({ items, color = 'green' }) {
  const colorClasses = {
    green: 'bg-green-500/10 border-green-500/20',
    blue: 'bg-blue-500/10 border-blue-500/20',
    red: 'bg-red-500/10 border-red-500/20',
    yellow: 'bg-yellow-500/10 border-yellow-500/20'
  };

  return (
    <div className="flex flex-wrap gap-2 text-xs text-gray-300">
      {items?.map((item) => (
        <span key={item} className={`px-3 py-1 border rounded-full ${colorClasses[color]}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

/**
 * CourseCard - Course display card
 */
function CourseCard({ course }) {
  return (
    <div className={`border-2 rounded-lg p-6 ${getStatusColor(course.status)} bg-opacity-20 transition-all duration-300 hover:bg-opacity-30`}>
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

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-blue-400 font-semibold">Category:</span>
          <span className="text-gray-300">{getCategoryIcon(course.category)} {course.category}</span>
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
        {course.url && <ExternalLink href={course.url} color="green">Access Course</ExternalLink>}
      </div>
    </div>
  );
}

/**
 * ResourceCard - Generic resource card (platforms, blogs, podcasts)
 */
function ResourceCard({ item, color, linkText, featureKey = 'keyFeatures' }) {
  const borderClasses = {
    blue: 'border-blue-500/30 hover:border-blue-400',
    red: 'border-red-500/30 hover:border-red-400',
    yellow: 'border-yellow-500/30 hover:border-yellow-400'
  };

  const textClasses = {
    blue: 'text-blue-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400'
  };

  return (
    <div className={`border rounded-lg p-6 bg-gray-900/60 transition-all duration-300 ${borderClasses[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{item.name}</h3>
          <p className="text-gray-400 text-sm">{item.description}</p>
        </div>
        <span className={`text-2xl ${textClasses[color]}`}>{getCategoryIcon(item.category)}</span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div>
          <span className={textClasses[color]}>{item.frequency ? 'Frequency' : 'Focus'}:</span>{' '}
          {item.frequency || item.focus}
        </div>
        <div>
          <span className="text-yellow-400">{item.format ? 'Format' : 'Focus'}:</span>{' '}
          {item.format || item.focus}
        </div>
      </div>

      <TagList items={item[featureKey] || item.keyTopics} color={color} />

      <div className="mt-4 flex justify-end">
        <ExternalLink href={item.url} color={color}>{linkText}</ExternalLink>
      </div>
    </div>
  );
}

// ============================================================================
// TAB CONTENT COMPONENTS
// ============================================================================

function CoursesTab({ courses }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-purple-400">📚 PROFESSIONAL COURSES</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        {courses?.map((course) => <CourseCard key={course.id} course={course} />)}
      </div>
    </div>
  );
}

function PlatformsTab({ platforms }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-400">💻 PLATFORMS</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        {platforms?.map((platform) => (
          <ResourceCard
            key={platform.id}
            item={platform}
            color="blue"
            linkText="Visit Platform"
            featureKey="keyFeatures"
          />
        ))}
      </div>
    </div>
  );
}

function BlogsTab({ blogs }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-400">📖 BLOGS & NEWS</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        {blogs?.map((blog) => (
          <ResourceCard
            key={blog.id}
            item={blog}
            color="red"
            linkText="Read Blog"
            featureKey="keyTopics"
          />
        ))}
      </div>
    </div>
  );
}

function PodcastsTab({ podcasts }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-yellow-400">🎧 PODCASTS & AUDIO</h2>
      <div className="grid lg:grid-cols-2 gap-6">
        {podcasts?.map((podcast) => (
          <ResourceCard
            key={podcast.id}
            item={podcast}
            color="yellow"
            linkText="Listen Now"
            featureKey="keyTopics"
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * LearningPage - Learning resources and courses
 */
export default function LearningPage() {
  const { data, loading } = useDataFetch('learning', {
    defaultValue: { learning: {} }
  });
  const [activeTab, setActiveTab] = useState('courses');

  if (loading) {
    return <LoadingSpinner icon="📚" message="Loading learning resources..." />;
  }

  const learning = data?.learning || {};

  const tabContent = {
    courses: <CoursesTab courses={learning.courses} />,
    platforms: <PlatformsTab platforms={learning.platforms} />,
    blogs: <BlogsTab blogs={learning.blogs} />,
    podcasts: <PodcastsTab podcasts={learning.podcasts} />
  };

  return (
    <PageLayout>
      <PageHeader
        title="LEARNING RESOURCES"
        subtitle="Continuous Education & Professional Development"
      />

      <PageContent>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        {tabContent[activeTab]}
      </PageContent>
    </PageLayout>
  );
}
