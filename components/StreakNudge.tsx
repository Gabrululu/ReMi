'use client'

import React from 'react'

interface StreakNudgeProps {
  streak?: number
  onGoToTasks: () => void
}

export function StreakNudge({ streak = 0, onGoToTasks }: StreakNudgeProps) {
  if (streak <= 0) return null

  return (
    <div className="rounded-xl border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 p-3 flex items-center justify-between">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-xl">🔥</div>
        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
            ¡Mantén tu racha!
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-300 truncate">
            Llevas {streak} día{streak === 1 ? '' : 's'} seguidos. Completa 1 tarea hoy.
          </div>
        </div>
      </div>
      <button
        onClick={onGoToTasks}
        className="ml-3 shrink-0 px-3 py-1.5 text-xs rounded-lg bg-yellow-500 text-white hover:bg-yellow-600"
      >
        Completar ahora
      </button>
    </div>
  )
}


