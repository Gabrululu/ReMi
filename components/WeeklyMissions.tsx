'use client'

import React, { useMemo, useState } from 'react'

interface WeeklyMissionsProps {
  userStats?: any
}

interface MissionDef {
  id: string
  title: string
  desc: string
  target: number
  progress: number
  emoji: string
}

export function WeeklyMissions({ userStats }: WeeklyMissionsProps) {
  const [showAll, setShowAll] = useState(false)
  const missions = useMemo<MissionDef[]>(() => {
    const tasksCompleted = Number(userStats?.tasksCompleted ?? 0)
    const weeklyGoals = Number(userStats?.weeklyGoals ?? 0)
    const streak = Number(userStats?.streak ?? 0)

    return [
      {
        id: 'm_tasks_5',
        title: 'Completa 5 tareas esta semana',
        desc: 'Suma constancia con tareas pequeñas',
        emoji: '✅',
        target: 5,
        progress: Math.min(tasksCompleted % 50, 5),
      },
      {
        id: 'm_goals_1',
        title: 'Alcanza 1 meta semanal',
        desc: 'Enfócate en un objetivo claro',
        emoji: '🎯',
        target: 1,
        progress: Math.min(weeklyGoals % 10, 1),
      },
      {
        id: 'm_streak_3',
        title: 'Mantén 3 días de racha',
        desc: 'Pequeños pasos todos los días',
        emoji: '🔥',
        target: 3,
        progress: Math.min(streak % 7, 3),
      },
    ]
  }, [userStats])

  const visible = showAll ? missions : missions.slice(0, 2)

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-3 md:p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Misiones semanales</h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Retos ligeros para mantener foco</p>
        </div>
        <div className="hidden md:block text-xs text-gray-500 dark:text-gray-400">Actualiza a lo largo de la semana</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
        {visible.map(m => {
          const pct = Math.round((m.progress / m.target) * 100)
          const done = m.progress >= m.target
          return (
            <div key={m.id} className={`rounded-lg p-3 border transition-colors ${done ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
              <div className="flex items-start gap-2">
                <div className="text-2xl">{m.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{m.title}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 hidden md:block truncate">{m.desc}</div>
                  <div className="mt-2">
                    <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div className={`h-full ${done ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{m.progress}/{m.target}</div>
                  </div>
                </div>
                {done && <span className="text-green-500 text-sm">✔</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Toggle ver más en mobile */}
      {missions.length > 2 && (
        <div className="mt-2 flex md:hidden justify-center">
          <button
            onClick={() => setShowAll(s => !s)}
            className="px-3 py-1 text-xs rounded-full bg-white/70 dark:bg-white/10 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200"
          >
            {showAll ? 'Ver menos' : 'Ver más'}
          </button>
        </div>
      )}
    </div>
  )
}


