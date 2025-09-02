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
      className="relative ml-3 mr-4 h-7 w-14 rounded-full border border-gray-300 bg-gray-100 shadow-inner transition-transform duration-150 hover:scale-[1.02] outline-none focus:outline-none"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Track */}
      <div className="absolute inset-0 rounded-full bg-gray-100" />

      {/* Knob */}
      <div
        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center transition-transform duration-300 ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        <span className="text-yellow-500 text-sm">☀️</span>
      </div>
    </button>
  );
} 