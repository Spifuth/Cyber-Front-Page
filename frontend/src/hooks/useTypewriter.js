import { useState, useCallback, useRef } from 'react';

/**
 * useTypewriter - Custom hook for typewriter text animation
 * 
 * @param {Object} options - Configuration options
 * @param {number} [options.speed=30] - Typing speed in milliseconds
 * @param {Function} [options.onComplete] - Callback when typing is complete
 * @returns {Object} - { text, isTyping, typeText, reset }
 */
export function useTypewriter({ speed = 30, onComplete } = {}) {
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef(null);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setText('');
    setIsTyping(false);
  }, []);

  const typeText = useCallback((fullText, callback) => {
    reset();
    setIsTyping(true);
    
    let currentIndex = 0;
    intervalRef.current = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
        if (callback) callback();
        if (onComplete) onComplete();
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [speed, onComplete, reset]);

  return { text, isTyping, typeText, reset };
}

/**
 * useTerminalTypewriter - Specialized typewriter hook for terminal output
 * 
 * @param {Function} setHistory - State setter for terminal history
 * @param {number} [speed=15] - Typing speed in milliseconds
 * @returns {Object} - { isTyping, typeWriter }
 */
export function useTerminalTypewriter(setHistory, speed = 15) {
  const [isTyping, setIsTyping] = useState(false);
  const intervalRef = useRef(null);

  const typeWriter = useCallback((text, callback) => {
    setIsTyping(true);
    let index = 0;
    const chars = text.split('');

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Add initial empty typing entry
    setHistory(prev => [...prev, { type: 'typing', content: '' }]);

    intervalRef.current = setInterval(() => {
      if (index < chars.length) {
        setHistory(prev => {
          const newHistory = [...prev];
          const lastEntry = newHistory[newHistory.length - 1];
          if (lastEntry && lastEntry.type === 'typing') {
            lastEntry.content += chars[index];
          }
          return newHistory;
        });
        index++;
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsTyping(false);
        
        // Convert typing entry to output
        setHistory(prev => {
          const newHistory = [...prev];
          const lastEntry = newHistory[newHistory.length - 1];
          if (lastEntry && lastEntry.type === 'typing') {
            lastEntry.type = 'output';
          }
          return newHistory;
        });

        if (callback) callback();
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [setHistory, speed]);

  return { isTyping, typeWriter };
}

export default useTypewriter;
