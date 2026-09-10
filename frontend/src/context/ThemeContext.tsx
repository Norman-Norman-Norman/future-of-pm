/* eslint-disable react-refresh/only-export-components */
import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from './themeContextUtils';
import { frontendLogger } from '../logger';

// Separate hook into its own component file to satisfy fast refresh
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Main component export
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme ? savedTheme === 'dark' : false;
    frontendLogger.info('Theme', `Initial theme loaded: ${isDark ? 'dark' : 'light'} (from ${savedTheme ? 'localStorage' : 'default'})`);
    return isDark;
  });

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    frontendLogger.stateChange('Theme', `Theme persisted: ${darkMode ? 'dark' : 'light'}`);
    
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleTheme = () => {
    frontendLogger.userAction('Toggle theme', { from: darkMode ? 'dark' : 'light', to: darkMode ? 'light' : 'dark' });
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}