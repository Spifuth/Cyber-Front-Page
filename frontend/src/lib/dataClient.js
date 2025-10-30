import { isMockEnabled } from './env';
import { getMockCollection } from '../mocks/mockBackend';

const cloneValue = (value) => {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value));
};

const DEFAULT_EMPTY_COLLECTION = { items: [] };

const EMPTY_COLLECTIONS = {
  projects: { projects: [], categories: {}, gallery_config: {} },
  timeline: { timeline: [] },
  infra: { infra: [] },
  skills: { skills: { technical: [], soft: [], tools: [] } },
  stack: { stack: [] },
  certs: { certs: [] },
  learning: { learning: [] },
  logs: { logs: [] },
  filesystem: { filesystem: { directories: {}, files: {} } },
};

const fetchJson = async (path) => {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  return response.json();
};

/**
 * Loads a JSON collection either from the local mocks or from the network.
 * @param {string} name collection identifier matching /public/data/*.json
 * @returns {Promise<Record<string, unknown>>}
 */
export const loadCollection = async (name) => {
  const normalizedName = String(name ?? '').trim();
  const fallback = EMPTY_COLLECTIONS[normalizedName] ?? DEFAULT_EMPTY_COLLECTION;

  if (!normalizedName || !EMPTY_COLLECTIONS[normalizedName]) {
    console.warn(
      `[dataClient] Unknown collection "${normalizedName}" requested; returning empty result.`
    );
    return cloneValue(fallback);
  }

  if (isMockEnabled()) {
    const mockData = await getMockCollection(normalizedName);
    return mockData ?? cloneValue(fallback);
  }

  return fetchJson(`/data/${normalizedName}.json`);
};
