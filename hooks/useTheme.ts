'use client';

import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface UseThemeReturn {
  theme: Theme;
  toggleTheme: () => void;
  mounted: boolean;
}

export function useTheme(): UseThemeReturn {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      // Get theme from localStorage or default to light
      const savedTheme = localStorage.getItem('theme') as Theme;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme) {
        setTheme(savedTheme);
      } else if (prefersDark) {
        setTheme('dark');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      // Update localStorage
      localStorage.setItem('theme', theme);
      // Update document class
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme, mounted };
} 