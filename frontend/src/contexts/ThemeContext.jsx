import { createContext, useContext, useEffect, useState } from 'react';

/**
 * @typedef {{theme: string, setTheme: (next: string) => void}} ThemeContextValue
 */

/**
 * React context storing the current visual theme and its setter.
 * @type {React.Context<ThemeContextValue | undefined>}
 */
const ThemeContext = createContext();

/**
 * Hook exposing the current theme state managed by {@link ThemeProvider}.
 * @returns {{theme: string, setTheme: (next: string) => void}}
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

/**
 * Provides theme state to the application and syncs it with the document root.
 * Defaults to the "dark" theme to preserve the intended styling offline.
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

