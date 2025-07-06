'use client';

import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 hover:scale-105"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-gray-100 rounded-full shadow-md transform transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        <div className="flex items-center justify-center w-full h-full">
          {theme === 'light' ? (
            <span className="text-yellow-500 text-xs">☀️</span>
          ) : (
            <span className="text-blue-500 text-xs">🌙</span>
          )}
        </div>
      </div>
    </button>
  );
} 