import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useSequentialLines - Hook for displaying lines sequentially with delays
 * 
 * @param {Array<{text: string, delay: number, type: string}>} lines - Array of line objects
 * @param {Object} [options] - Options
 * @param {boolean} [options.autoStart=true] - Start automatically
 * @param {Function} [options.onComplete] - Callback when all lines are shown
 * @returns {Object} - { currentLine, visibleLines, isComplete, reset, start }
 */
export function useSequentialLines(lines, { autoStart = true, onComplete } = {}) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(autoStart);
  const timeoutRef = useRef(null);

  const reset = useCallback(() => {
    setCurrentLine(0);
    setIsComplete(false);
    setIsStarted(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const start = useCallback(() => {
    reset();
    setIsStarted(true);
  }, [reset]);

  useEffect(() => {
    if (!isStarted || isComplete) return;

    if (currentLine < lines.length) {
      const delay = lines[currentLine]?.delay || 1000;
      timeoutRef.current = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, delay);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    } else {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentLine, lines, isStarted, isComplete, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const visibleLines = lines.slice(0, currentLine);

  return { 
    currentLine, 
    visibleLines, 
    isComplete, 
    reset, 
    start,
    isLastLine: currentLine === lines.length - 1
  };
}

/**
 * useGlitchText - Hook for text with random glitch effect
 * 
 * @param {string} originalText - Original text to glitch
 * @param {Object} [options] - Options
 * @param {number} [options.interval=3000] - Glitch interval in ms
 * @param {number} [options.duration=100] - Glitch duration in ms
 * @param {number} [options.probability=0.8] - Probability of char staying normal (0-1)
 * @returns {string} - Current text (glitched or original)
 */
export function useGlitchText(originalText, { interval = 3000, duration = 100, probability = 0.8 } = {}) {
  const [text, setText] = useState(originalText);

  useEffect(() => {
    const glitchTimer = setInterval(() => {
      // Create glitched version
      const glitched = originalText
        .split('')
        .map(char => Math.random() > probability ? String.fromCharCode(33 + Math.random() * 94) : char)
        .join('');
      
      setText(glitched);
      
      // Reset after duration
      setTimeout(() => setText(originalText), duration);
    }, interval);

    return () => clearInterval(glitchTimer);
  }, [originalText, interval, duration, probability]);

  return text;
}

/**
 * useDelayedState - State that activates after a delay
 * 
 * @param {boolean} initialValue - Initial value
 * @param {number} delay - Delay before activation in ms
 * @returns {[boolean, Function]} - [value, trigger]
 */
export function useDelayedState(initialValue = false, delay = 2000) {
  const [value, setValue] = useState(initialValue);
  const timeoutRef = useRef(null);

  const trigger = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setValue(true);
    }, delay);
  }, [delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [initialValue]);

  return [value, trigger, reset];
}

/**
 * useCountdown - Countdown timer hook
 * 
 * @param {number} initialCount - Starting count
 * @param {Object} [options] - Options
 * @param {Function} [options.onComplete] - Callback when countdown reaches 0
 * @param {boolean} [options.autoStart=false] - Start automatically
 * @returns {Object} - { count, isRunning, start, pause, reset }
 */
export function useCountdown(initialCount, { onComplete, autoStart = false } = {}) {
  const [count, setCount] = useState(initialCount);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setCount(initialCount);
    setIsRunning(false);
  }, [initialCount]);

  useEffect(() => {
    if (isRunning && count > 0) {
      intervalRef.current = setInterval(() => {
        setCount(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, count, onComplete]);

  return { count, isRunning, start, pause, reset };
}

/**
 * useSafeTimers - Hook that manages timers with automatic cleanup
 * 
 * @returns {Object} - { setTimeout, setInterval, clearAll }
 */
export function useSafeTimers() {
  const timeoutIds = useRef(new Set());
  const intervalIds = useRef(new Set());

  const safeSetTimeout = useCallback((callback, delay) => {
    const id = setTimeout(() => {
      callback();
      timeoutIds.current.delete(id);
    }, delay);
    timeoutIds.current.add(id);
    return id;
  }, []);

  const safeSetInterval = useCallback((callback, delay) => {
    const id = setInterval(callback, delay);
    intervalIds.current.add(id);
    return id;
  }, []);

  const safeClearTimeout = useCallback((id) => {
    clearTimeout(id);
    timeoutIds.current.delete(id);
  }, []);

  const safeClearInterval = useCallback((id) => {
    clearInterval(id);
    intervalIds.current.delete(id);
  }, []);

  const clearAll = useCallback(() => {
    timeoutIds.current.forEach(id => clearTimeout(id));
    intervalIds.current.forEach(id => clearInterval(id));
    timeoutIds.current.clear();
    intervalIds.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return clearAll;
  }, [clearAll]);

  return { 
    setTimeout: safeSetTimeout, 
    setInterval: safeSetInterval,
    clearTimeout: safeClearTimeout,
    clearInterval: safeClearInterval,
    clearAll 
  };
}

export default {
  useSequentialLines,
  useGlitchText,
  useDelayedState,
  useCountdown,
  useSafeTimers
};
