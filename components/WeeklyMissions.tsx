'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { createRemiProgressContract } from '../lib/contracts'

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
  onChainProgress?: number
}

export function WeeklyMissions({ userStats }: WeeklyMissionsProps) {
  const { address } = useAccount()
  const [showAll, setShowAll] = useState(false)
  const [onChainMissions, setOnChainMissions] = useState<any>({})
  const [loading, setLoading] = useState(false)

  // Load on-chain mission progress
  useEffect(() => {
    const loadOnChainProgress = async () => {
      if (!address) return
      
      setLoading(true)
      try {
        const progressContract = createRemiProgressContract('baseSepolia') // Default network
        const missionIds = [101, 102, 103] // Week 1, missions 0, 1, 2
        
        const progress: any = {}
        for (const missionId of missionIds) {
          try {
            const missionProgress = await progressContract.getProgresoMision(address, missionId)
            progress[missionId] = Number(missionProgress)
          } catch (error) {
            console.warn(`Failed to load mission ${missionId} progress:`, error)
          }
        }
        setOnChainMissions(progress)
      } catch (error) {
        console.warn('Failed to load on-chain missions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadOnChainProgress()
  }, [address])

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
        onChainProgress: onChainMissions[101] || 0,
      },
      {
        id: 'm_goals_1',
        title: 'Alcanza 1 meta semanal',
        desc: 'Enfócate en un objetivo claro',
        emoji: '🎯',
        target: 1,
        progress: Math.min(weeklyGoals % 10, 1),
        onChainProgress: onChainMissions[102] || 0,
      },
      {
        id: 'm_streak_3',
        title: 'Mantén 3 días de racha',
        desc: 'Pequeños pasos todos los días',
        emoji: '🔥',
        target: 3,
        progress: Math.min(streak % 7, 3),
        onChainProgress: onChainMissions[103] || 0,
      },
    ]
  }, [userStats, onChainMissions])

  const visible = showAll ? missions : missions.slice(0, 2)

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-3 md:p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Misiones semanales</h3>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">Retos ligeros para mantener foco</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          {loading && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
          )}
          <div className="text-xs text-gray-500 dark:text-gray-400">Actualiza a lo largo de la semana</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
        {visible.map(m => {
          // Use on-chain progress if available, otherwise fall back to local
          const actualProgress = m.onChainProgress !== undefined ? m.onChainProgress : m.progress
          const pct = Math.round((actualProgress / m.target) * 100)
          const done = actualProgress >= m.target
          const hasOnChainData = m.onChainProgress !== undefined
          
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
                    <div className="mt-1 flex items-center justify-between">
                      <div className="text-[11px] text-gray-500 dark:text-gray-400">{actualProgress}/{m.target}</div>
                      {hasOnChainData && (
                        <div className="text-[10px] text-blue-500 dark:text-blue-400">On-chain ✓</div>
                      )}
                    </div>
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


