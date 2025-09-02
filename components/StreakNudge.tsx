'use client'

import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { createRemiProgressContract } from '../lib/contracts'

interface StreakNudgeProps {
  userStats?: any
  setActiveTab: (tab: string) => void
}

export function StreakNudge({ userStats, setActiveTab }: StreakNudgeProps) {
  const { address } = useAccount()
  const [loading, setLoading] = useState(false)
  
  const streak = userStats?.streak || 0
  
  if (streak <= 0) return null

  const handleBumpStreak = async () => {
    if (!address) return
    
    setLoading(true)
    try {
      const progressContract = createRemiProgressContract('baseSepolia') // Default network
      await progressContract.connectWallet()
      const success = await progressContract.bumpStreak()
      
      if (success) {
        console.log('Streak bumped on-chain ✓')
        // Optionally show a success message or update UI
      }
    } catch (error) {
      console.warn('Failed to bump streak on-chain:', error)
    } finally {
      setLoading(false)
    }
  }

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
      <div className="flex gap-2 ml-3 shrink-0">
        <button
          onClick={() => setActiveTab('tasks')}
          className="px-3 py-1.5 text-xs rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
        >
          Completar ahora
        </button>
        <button
          onClick={handleBumpStreak}
          disabled={loading}
          className="px-3 py-1.5 text-xs rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {loading ? '...' : 'Check-in'}
        </button>
      </div>
    </div>
  )
}


