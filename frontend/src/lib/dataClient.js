import { isMockEnabled } from './env';
import { getMockCollection } from '../mocks/mockBackend';

const fetchJson = async (path) => {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.status}`);
  }
  return response.json();
};

export const loadCollection = async (name) => {
  if (isMockEnabled()) {
    return getMockCollection(name);
  }
  return fetchJson(`/data/${name}.json`);
};
