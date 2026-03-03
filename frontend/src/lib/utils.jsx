/**
 * Utility functions for styling and formatting
 */

// ============================================================================
// COLOR UTILITIES
// ============================================================================

/**
 * Color palette for consistent theming across the app
 */
export const COLORS = {
  green: {
    text: 'text-green-400',
    bg: 'bg-green-500',
    bgLight: 'bg-green-500/10',
    bgDark: 'bg-green-900',
    border: 'border-green-400',
    borderLight: 'border-green-500/30'
  },
  blue: {
    text: 'text-blue-400',
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-500/10',
    bgDark: 'bg-blue-900',
    border: 'border-blue-400',
    borderLight: 'border-blue-500/30'
  },
  yellow: {
    text: 'text-yellow-400',
    bg: 'bg-yellow-500',
    bgLight: 'bg-yellow-500/10',
    bgDark: 'bg-yellow-900',
    border: 'border-yellow-400',
    borderLight: 'border-yellow-500/30'
  },
  orange: {
    text: 'text-orange-400',
    bg: 'bg-orange-500',
    bgLight: 'bg-orange-500/10',
    bgDark: 'bg-orange-900',
    border: 'border-orange-400',
    borderLight: 'border-orange-500/30'
  },
  red: {
    text: 'text-red-400',
    bg: 'bg-red-500',
    bgLight: 'bg-red-500/10',
    bgDark: 'bg-red-900',
    border: 'border-red-400',
    borderLight: 'border-red-500/30'
  },
  purple: {
    text: 'text-purple-400',
    bg: 'bg-purple-500',
    bgLight: 'bg-purple-500/10',
    bgDark: 'bg-purple-900',
    border: 'border-purple-400',
    borderLight: 'border-purple-500/30'
  },
  gray: {
    text: 'text-gray-400',
    bg: 'bg-gray-500',
    bgLight: 'bg-gray-500/10',
    bgDark: 'bg-gray-900',
    border: 'border-gray-400',
    borderLight: 'border-gray-500/30'
  }
};

/**
 * Returns Tailwind classes for project/task status badges.
 * @param {string} status - Status identifier (active, completed, beta, etc.)
 * @returns {string} Tailwind CSS classes
 */
export function getStatusColor(status) {
  const statusMap = {
    active: `${COLORS.green.text} ${COLORS.green.borderLight} ${COLORS.green.bgLight}`,
    completed: `${COLORS.blue.text} ${COLORS.blue.borderLight} ${COLORS.blue.bgLight}`,
    beta: `${COLORS.yellow.text} ${COLORS.yellow.borderLight} ${COLORS.yellow.bgLight}`,
    in_development: `${COLORS.orange.text} ${COLORS.orange.borderLight} ${COLORS.orange.bgLight}`,
    archived: `${COLORS.gray.text} ${COLORS.gray.borderLight} ${COLORS.gray.bgLight}`
  };
  return statusMap[status] || statusMap.archived;
}

/**
 * Returns Tailwind classes for log level badges.
 * @param {string} level - Log level (INFO, WARN, ERROR, CRITICAL)
 * @returns {string} Tailwind CSS classes
 */
export function getLogLevelColor(level) {
  const colors = {
    INFO: `${COLORS.green.text} ${COLORS.green.bgDark}`,
    WARN: `${COLORS.yellow.text} ${COLORS.yellow.bgDark}`,
    ERROR: `${COLORS.red.text} ${COLORS.red.bgDark}`,
    CRITICAL: `${COLORS.red.text} ${COLORS.red.bgDark} animate-pulse`
  };
  return colors[level] || `${COLORS.gray.text} ${COLORS.gray.bgDark}`;
}

/**
 * Returns Tailwind classes for skill level badges.
 * @param {string} level - Skill level (Expert, Advanced, Intermediate, Beginner)
 * @returns {string} Tailwind CSS classes
 */
export function getSkillLevelColor(level) {
  const colors = {
    Expert: COLORS.green.bg,
    Advanced: COLORS.blue.bg,
    Intermediate: COLORS.yellow.bg,
    Beginner: COLORS.gray.bg
  };
  return colors[level] || COLORS.gray.bg;
}

/**
 * Returns full color object for skill level.
 * @param {string} level - Skill level
 * @returns {Object} Color object with text, bg, border classes
 */
export function getSkillLevelColorFull(level) {
  const levelColors = {
    Expert: COLORS.green,
    Advanced: COLORS.blue,
    Intermediate: COLORS.yellow,
    Beginner: COLORS.gray
  };
  return levelColors[level] || COLORS.gray;
}

/**
 * Returns Tailwind classes for severity badges.
 * @param {string} severity - Severity level (LOW, MEDIUM, HIGH, CRITICAL)
 * @returns {string} Tailwind CSS classes
 */
export function getSeverityColor(severity) {
  const colors = {
    LOW: `${COLORS.blue.text} ${COLORS.blue.bgDark}`,
    MEDIUM: `${COLORS.yellow.text} ${COLORS.yellow.bgDark}`,
    HIGH: `${COLORS.orange.text} ${COLORS.orange.bgDark}`,
    CRITICAL: `${COLORS.red.text} ${COLORS.red.bgDark}`
  };
  return colors[severity] || `${COLORS.gray.text} ${COLORS.gray.bgDark}`;
}

// ============================================================================
// FORMAT UTILITIES
// ============================================================================

/**
 * Format a date string to localized format
 * @param {string|Date} date - Date to format
 * @param {string} [locale='fr-FR'] - Locale string
 * @returns {string} Formatted date
 */
export function formatDate(date, locale = 'fr-FR') {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return date;
  }
}

/**
 * Format time to HH:MM:SS
 * @param {Date} date - Date object
 * @returns {string} Formatted time
 */
export function formatTime(date) {
  return date.toTimeString().slice(0, 8);
}

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalizeWords(str) {
  if (!str) return '';
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} [maxLength=100] - Maximum length
 * @returns {string} Truncated text
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// ============================================================================
// LEVEL/PROGRESS UTILITIES
// ============================================================================

/**
 * Get progress percentage for skill level
 * @param {string} level - Skill level
 * @returns {number} Progress percentage (0-100)
 */
export function getLevelProgress(level) {
  const progress = {
    Expert: 100,
    Advanced: 80,
    Intermediate: 60,
    Beginner: 30
  };
  return progress[level] || 0;
}
