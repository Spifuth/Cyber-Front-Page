import { isMockEnabled } from './env';
import { getMockCollection } from '../mocks/mockBackend';

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
 */
export const loadCollection = async (name) => {
  if (!name) {
    throw new Error('loadCollection requires a collection name');
  }
  if (isMockEnabled()) {
    return getMockCollection(name);
  }
  return fetchJson(`/data/${name}.json`);
};
