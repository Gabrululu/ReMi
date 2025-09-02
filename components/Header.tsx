'use client'

import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  rightCtas?: React.ReactNode
}

export function Header({ rightCtas }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="text-3xl">⏰</div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            ReMi
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Agenda Social Web3
          </p>
        </div>
      </div>

      {/* Right CTAs */}
      <div className="flex items-center space-x-4">
        {rightCtas}
        <ThemeToggle />
      </div>
    </header>
  )
}
