const normalize = (value) => String(value ?? '').trim();

/**
 * Returns true when the UI should rely on local mocks instead of network calls.
 * Missing or falsy `VITE_USE_MOCK` defaults to enabled mocks to preserve offline mode.
 */
export const isMockEnabled = () => {
  const raw = normalize(import.meta.env.VITE_USE_MOCK);
  if (!raw) return true;
  return ['1', 'true', 'yes', 'on'].includes(raw.toLowerCase());
};

/**
 * Reads a Vite environment variable with an optional fallback.
 * @param {string} key
 * @param {string} [fallback]
 */
export const getEnvVar = (key, fallback = '') => {
  const raw = import.meta.env[key];
  return raw === undefined ? fallback : raw;
};

/**
 * Returns an external URL only when mocks are disabled and the value is non-empty.
 * Guarantees a safe fallback ("#") while offline.
 */
export const getExternalUrl = (key, fallback = '#') => {
  const value = normalize(getEnvVar(key, ''));
  if (!value) {
    return fallback;
  }
  if (isMockEnabled()) {
    return fallback;
  }
  return value;
};
