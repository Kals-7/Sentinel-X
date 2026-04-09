import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemPreference;
    
    setTheme(initialTheme);
    document.documentElement.className = initialTheme;
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  return { theme, toggleTheme };
};
