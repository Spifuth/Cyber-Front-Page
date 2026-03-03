import { useState, useEffect, useCallback } from 'react';
import { loadCollection } from '../lib/dataClient';

/**
 * useDataFetch - Generic hook for fetching data collections
 * 
 * @param {string} collectionName - Name of the collection to fetch
 * @param {Function|Object} [transformOrOptions] - Transform function or options object
 * @param {Object} [options] - Options (if first arg is transform)
 * @returns {Object} - { data, setData, loading, error, refetch }
 */
export function useDataFetch(collectionName, transformOrOptions, options = {}) {
  // Handle both signatures: useDataFetch(name, transform) and useDataFetch(name, { options })
  const transform = typeof transformOrOptions === 'function' ? transformOrOptions : null;
  const opts = typeof transformOrOptions === 'object' ? transformOrOptions : options;
  const { defaultValue = null, immediate = true } = opts;

  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loadCollection(collectionName);
      const transformedResult = transform ? transform(result) : result;
      setData(transformedResult);
      return transformedResult;
    } catch (err) {
      console.error(`Error loading ${collectionName}:`, err);
      setError(err);
      setData(defaultValue);
      return defaultValue;
    } finally {
      setLoading(false);
    }
  }, [collectionName, defaultValue, transform]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, [immediate, fetchData]);

  return { data, setData, loading, error, refetch: fetchData };
}

/**
 * useLocalStorage - Persist state to localStorage
 * 
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value
 * @returns {[*, Function]} - [value, setValue]
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

/**
 * useFilter - State management for filterable lists
 * 
 * @param {Array} items - Items to filter
 * @param {string} filterKey - Property key to filter by
 * @param {string} [defaultFilter='all'] - Default filter value
 * @returns {Object} - { filter, setFilter, filteredItems, filterOptions }
 */
export function useFilter(items = [], filterKey, defaultFilter = 'all') {
  const [filter, setFilter] = useState(defaultFilter);

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item[filterKey] === filter);

  const filterOptions = ['all', ...new Set(items.map(item => item[filterKey]).filter(Boolean))];

  return { filter, setFilter, filteredItems, filterOptions };
}

/**
 * useToggle - Simple boolean toggle
 * 
 * @param {boolean} [initialValue=false] - Initial state
 * @returns {[boolean, Function, Function, Function]} - [value, toggle, setTrue, setFalse]
 */
export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return [value, toggle, setTrue, setFalse];
}

/**
 * useDebounce - Debounce a value
 * 
 * @param {*} value - Value to debounce
 * @param {number} [delay=300] - Delay in ms
 * @returns {*} - Debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useCopyToClipboard - Copy text to clipboard with feedback
 * 
 * @param {number} [resetDelay=2000] - Delay before resetting copied state
 * @returns {Object} - { copiedField, copyToClipboard }
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copiedField, setCopiedField] = useState('');

  const copyToClipboard = useCallback((text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), resetDelay);
    });
  }, [resetDelay]);

  return { copiedField, copyToClipboard };
}

/**
 * useForm - Simple form state management
 * 
 * @param {Object} initialValues - Initial form values
 * @returns {Object} - { values, handleChange, reset, setValues }
 */
export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const reset = useCallback(() => setValues(initialValues), [initialValues]);

  return { values, handleChange, reset, setValues };
}

export default {
  useDataFetch,
  useLocalStorage,
  useFilter,
  useToggle,
  useDebounce
};
