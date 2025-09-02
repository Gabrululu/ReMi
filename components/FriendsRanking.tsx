'use client'

import React from 'react'

export interface RankingItem {
  id: string
  name: string
  avatar?: string
  score: number // p.ej. tareas completadas esta semana
}

interface FriendsRankingProps {
  title?: string
  items?: RankingItem[]
}

export function FriendsRanking({ title = 'Amigos activos', items }: FriendsRankingProps) {
  const mock: RankingItem[] = [
    { id: '1', name: '3B', avatar: undefined, score: 12 },
    { id: '2', name: 'Ana', avatar: undefined, score: 9 },
    { id: '3', name: 'Luis', avatar: undefined, score: 7 },
  ]

  const data = (items && items.length > 0 ? items : mock)
    .slice(0, 3)
    .sort((a, b) => b.score - a.score)

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">semanal</span>
      </div>

      <div className="space-y-2">
        {data.map((u, idx) => (
          <div key={u.id} className="flex items-center justify-between rounded-lg p-2 bg-gray-50 dark:bg-gray-700/40">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-6 text-center text-sm font-semibold text-gray-500 dark:text-gray-300">{idx + 1}</div>
              {u.avatar ? (
                <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                  {u.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="truncate text-sm text-gray-900 dark:text-white">{u.name}</div>
            </div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {u.score} pts
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
        Pronto: conecta tus amigos reales para competir sanamente.
      </div>
    </div>
  )
}


