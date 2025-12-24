import { useNavigate } from 'react-router-dom';

/**
 * PageHeader - Shared header component for all pages
 * 
 * @param {Object} props
 * @param {string} props.title - Page title (with ► prefix added automatically)
 * @param {string} props.subtitle - Page subtitle/description
 * @param {string} [props.backPath='/'] - Navigation path for back button
 * @param {string} [props.backText='Back to Terminal'] - Back button text
 */
export function PageHeader({ 
  title, 
  subtitle, 
  backPath = '/', 
  backText = 'Back to Terminal' 
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black border-b-2 border-green-400 p-8">
      <button
        onClick={() => navigate(backPath)}
        className="mb-6 px-4 py-2 bg-green-400 text-black hover:bg-green-300 transition-colors rounded"
      >
        ← {backText}
      </button>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 text-green-400">► {title}</h1>
        <p className="text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

/**
 * PageLayout - Base layout wrapper for all pages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.className] - Additional CSS classes
 */
export function PageLayout({ children, className = '' }) {
  return (
    <div className={`min-h-screen bg-black text-green-400 font-mono ${className}`}>
      {children}
    </div>
  );
}

/**
 * PageContent - Centered content container
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content
 * @param {string} [props.maxWidth='max-w-6xl'] - Max width class
 */
export function PageContent({ children, maxWidth = 'max-w-6xl' }) {
  return (
    <div className={`${maxWidth} mx-auto p-8`}>
      {children}
    </div>
  );
}

/**
 * LoadingSpinner - Consistent loading state across pages
 * 
 * @param {Object} props
 * @param {string} [props.icon='⚡'] - Loading icon/emoji
 * @param {string} [props.message='Loading...'] - Loading message
 */
export function LoadingSpinner({ icon = '⚡', message = 'Loading...' }) {
  return (
    <PageLayout>
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">{icon}</div>
          <p className="text-green-400">{message}</p>
        </div>
      </div>
    </PageLayout>
  );
}

/**
 * SectionCard - Reusable card container with border
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.borderColor='border-green-400'] - Border color class
 * @param {string} [props.className] - Additional classes
 */
export function SectionCard({ 
  children, 
  borderColor = 'border-green-400',
  className = '' 
}) {
  return (
    <div className={`bg-gray-900/60 border ${borderColor} rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
}

/**
 * FilterButton - Reusable filter/tab button
 * 
 * @param {Object} props
 * @param {boolean} props.active - Is this filter active
 * @param {Function} props.onClick - Click handler
 * @param {React.ReactNode} props.children - Button content
 */
export function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded border transition-colors ${
        active
          ? 'border-green-400 bg-green-500/20 text-green-200'
          : 'border-gray-700 text-gray-400 hover:border-green-400/40 hover:text-green-200'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * SkillBadge - Small badge for skills/tags
 * 
 * @param {Object} props
 * @param {string} props.children - Badge text
 * @param {string} [props.variant='default'] - Badge variant
 */
export function SkillBadge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-gray-700 text-gray-300',
    green: 'bg-green-500/10 border border-green-500/20 text-green-300',
    blue: 'bg-blue-500/10 border border-blue-500/20 text-blue-300'
  };

  return (
    <span className={`px-2 py-1 text-xs rounded ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
}

export default {
  PageHeader,
  PageLayout,
  PageContent,
  LoadingSpinner,
  SectionCard,
  FilterButton,
  SkillBadge
};
