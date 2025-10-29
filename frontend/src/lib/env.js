const normalize = (value) => String(value ?? '').trim();

export const isMockEnabled = () => {
  const raw = normalize(import.meta.env.VITE_USE_MOCK);
  if (!raw) return true;
  return ['1', 'true', 'yes', 'on'].includes(raw.toLowerCase());
};

export const getEnvVar = (key, fallback = '') => {
  const raw = import.meta.env[key];
  return raw === undefined ? fallback : raw;
};

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
