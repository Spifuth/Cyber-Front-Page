import { useNavigate } from 'react-router-dom';

/**
 * NavigationCard - A reusable card component for navigation sections
 * 
 * @param {Object} props - Component props
 * @param {string} props.to - Navigation path
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.color - Tailwind color name (green, blue, purple, etc.)
 * @param {string} props.badge - Badge text label
 * @param {string} props.title - Card title
 * @param {string} props.description - Card description
 * @param {string} props.linkText - Text for the navigation link
 * @param {Function} [props.onClick] - Optional click handler (overrides navigation)
 */
export default function NavigationCard({
  to,
  icon: Icon,
  color,
  badge,
  title,
  description,
  linkText,
  onClick
}) {
  const navigate = useNavigate();

  const colorClasses = {
    green: {
      bg: 'bg-green-500/20',
      icon: 'text-green-400',
      badge: 'border-green-500/30 bg-green-500/10 text-green-400',
      hover: 'group-hover:text-green-400',
      link: 'text-green-400'
    },
    blue: {
      bg: 'bg-blue-500/20',
      icon: 'text-blue-400',
      badge: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
      hover: 'group-hover:text-blue-400',
      link: 'text-blue-400'
    },
    purple: {
      bg: 'bg-purple-500/20',
      icon: 'text-purple-400',
      badge: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
      hover: 'group-hover:text-purple-400',
      link: 'text-purple-400'
    },
    yellow: {
      bg: 'bg-yellow-500/20',
      icon: 'text-yellow-400',
      badge: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
      hover: 'group-hover:text-yellow-400',
      link: 'text-yellow-400'
    },
    red: {
      bg: 'bg-red-500/20',
      icon: 'text-red-400',
      badge: 'border-red-500/30 bg-red-500/10 text-red-400',
      hover: 'group-hover:text-red-400',
      link: 'text-red-400'
    },
    indigo: {
      bg: 'bg-indigo-500/20',
      icon: 'text-indigo-400',
      badge: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
      hover: 'group-hover:text-indigo-400',
      link: 'text-indigo-400'
    },
    teal: {
      bg: 'bg-teal-500/20',
      icon: 'text-teal-400',
      badge: 'border-teal-500/30 bg-teal-500/10 text-teal-400',
      hover: 'group-hover:text-teal-400',
      link: 'text-teal-400'
    },
    orange: {
      bg: 'bg-orange-500/20',
      icon: 'text-orange-400',
      badge: 'border-orange-500/30 bg-orange-500/10 text-orange-400',
      hover: 'group-hover:text-orange-400',
      link: 'text-orange-400'
    },
    pink: {
      bg: 'bg-pink-500/20',
      icon: 'text-pink-400',
      badge: 'border-pink-500/30 bg-pink-500/10 text-pink-400',
      hover: 'group-hover:text-pink-400',
      link: 'text-pink-400'
    }
  };

  const colors = colorClasses[color] || colorClasses.green;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 hover:border-green-500/50 transition-all duration-300 hover:bg-gray-900/80 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${colors.bg} rounded-lg`}>
          <Icon className={`h-6 w-6 ${colors.icon}`} />
        </div>
        <div className={`px-3 py-1 rounded-full text-xs border ${colors.badge}`}>
          {badge}
        </div>
      </div>
      <h3 className={`text-xl font-semibold mb-3 text-white ${colors.hover} transition-colors`}>
        {title}
      </h3>
      <p className="text-gray-400 mb-4 leading-relaxed">
        {description}
      </p>
      <div className={`${colors.link} text-sm font-mono`}>→ {linkText}</div>
    </div>
  );
}
