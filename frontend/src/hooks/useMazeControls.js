import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Color options for the maze
 */
export const MAZE_COLOR_OPTIONS = [
  { name: 'green', color: 'rgb(34, 197, 94)', label: 'Matrix Green' },
  { name: 'blue', color: 'rgb(59, 130, 246)', label: 'Cyber Blue' },
  { name: 'purple', color: 'rgb(139, 92, 246)', label: 'Neon Purple' },
  { name: 'red', color: 'rgb(239, 68, 68)', label: 'Alert Red' },
  { name: 'yellow', color: 'rgb(245, 158, 11)', label: 'Warning Yellow' }
];

/**
 * useMazeControls - Custom hook for managing maze background settings
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} [options.defaultEnabled=true] - Whether maze is enabled by default
 * @param {string} [options.defaultColor='green'] - Default maze color
 * @param {number} [options.defaultOpacity=0.25] - Default maze opacity
 * @returns {Object} - Maze control state and functions
 */
export function useMazeControls({
  defaultEnabled = true,
  defaultColor = 'green',
  defaultOpacity = 0.25
} = {}) {
  const [isEnabled, setIsEnabled] = useState(defaultEnabled);
  const [color, setColor] = useState(defaultColor);
  const [opacity, setOpacity] = useState(defaultOpacity);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPicker]);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const selectColor = useCallback((colorName) => {
    setColor(colorName);
    setShowColorPicker(false);
  }, []);

  const toggleOpacity = useCallback(() => {
    setOpacity(prev => prev === 0.25 ? 0.1 : 0.25);
  }, []);

  const toggleColorPicker = useCallback(() => {
    setShowColorPicker(prev => !prev);
  }, []);

  return {
    // State
    isEnabled,
    color,
    opacity,
    showColorPicker,
    colorPickerRef,
    colorOptions: MAZE_COLOR_OPTIONS,
    
    // Actions
    toggle,
    setColor,
    selectColor,
    setOpacity,
    toggleOpacity,
    toggleColorPicker,
    setShowColorPicker
  };
}

/**
 * useTerminalModal - Custom hook for terminal modal management
 * 
 * @returns {Object} - Terminal modal state and functions
 */
export function useTerminalModal() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const dialogRef = useRef(null);

  // Handle escape key and focus management
  useEffect(() => {
    if (!isOpen) {
      buttonRef.current?.focus();
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    buttonRef,
    dialogRef,
    open,
    close,
    toggle
  };
}

export default useMazeControls;
