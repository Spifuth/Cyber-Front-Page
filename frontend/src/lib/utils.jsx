/**
 * Returns Tailwind classes for project/task status badges.
 * @param {string} status - Status identifier (active, completed, beta, etc.)
 * @returns {string} Tailwind CSS classes
 */
export function getStatusColor(status) {
  const statusMap = {
    active: 'text-green-400 border-green-500/30 bg-green-500/10',
    completed: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    beta: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    in_development: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    archived: 'text-gray-400 border-gray-500/30 bg-gray-500/10'
  };
  return statusMap[status] || 'text-gray-400 border-gray-500/30 bg-gray-500/10';
}

/**
 * Returns Tailwind classes for log level badges.
 * @param {string} level - Log level (INFO, WARN, ERROR, CRITICAL)
 * @returns {string} Tailwind CSS classes
 */
export function getLogLevelColor(level) {
  const colors = {
    INFO: 'text-green-400 bg-green-900',
    WARN: 'text-yellow-400 bg-yellow-900',
    ERROR: 'text-red-400 bg-red-900',
    CRITICAL: 'text-red-400 bg-red-900 animate-pulse'
  };
  return colors[level] || 'text-gray-400 bg-gray-900';
}

/**
 * Returns Tailwind classes for skill level badges.
 * @param {string} level - Skill level (Expert, Advanced, Intermediate, Beginner)
 * @returns {string} Tailwind CSS classes
 */
export function getSkillLevelColor(level) {
  const colors = {
    Expert: 'bg-green-500',
    Advanced: 'bg-blue-500',
    Intermediate: 'bg-yellow-500',
    Beginner: 'bg-gray-500'
  };
  return colors[level] || 'bg-gray-500';
}

/**
 * Returns Tailwind classes for severity badges.
 * @param {string} severity - Severity level (LOW, MEDIUM, HIGH, CRITICAL)
 * @returns {string} Tailwind CSS classes
 */
export function getSeverityColor(severity) {
  const colors = {
    LOW: 'text-blue-400 bg-blue-900',
    MEDIUM: 'text-yellow-400 bg-yellow-900',
    HIGH: 'text-orange-400 bg-orange-900',
    CRITICAL: 'text-red-400 bg-red-900'
  };
  return colors[severity] || 'text-gray-400 bg-gray-900';
}
