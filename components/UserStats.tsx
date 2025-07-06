'use client';

import React from 'react';
import { useAccount, useBalance } from 'wagmi';

interface UserStatsProps {
  userStats: {
    tasksCompleted: number;
    streak: number;
    balance: number;
    weeklyGoals: number;
  } | null;
  network: 'baseSepolia' | 'celoAlfajores';
  loading: boolean;
}

export function UserStats({ userStats, network, loading }: UserStatsProps) {
  const { address } = useAccount();
  
  const { data: balance } = useBalance({
    address,
    token: network === 'baseSepolia' 
      ? '0x2bd8AbEB2F5598f8477560C70c742aFfc22912de'
      : '0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B'
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando estadísticas...</span>
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Sin estadísticas aún
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Completa tu primera tarea para ver tus estadísticas
          </p>
        </div>
      </div>
    );
  }

  const getStreakEmoji = (streak: number) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '💪';
  };

  const getLevel = (tasksCompleted: number) => {
    if (tasksCompleted >= 100) return { level: 'Maestro', emoji: '👑' };
    if (tasksCompleted >= 50) return { level: 'Experto', emoji: '⭐' };
    if (tasksCompleted >= 20) return { level: 'Avanzado', emoji: '🚀' };
    if (tasksCompleted >= 10) return { level: 'Intermedio', emoji: '📈' };
    if (tasksCompleted >= 5) return { level: 'Principiante', emoji: '🌱' };
    return { level: 'Novato', emoji: '🎯' };
  };

  const level = getLevel(userStats.tasksCompleted);

  return (
    <div className="space-y-6">
      {/* Level and Progress */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">{level.emoji}</div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{level.level}</h3>
          <p className="text-gray-600 dark:text-gray-300">Nivel actual</p>
        </div>
        
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progreso</span>
            <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
              {userStats.tasksCompleted} tareas
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((userStats.tasksCompleted / 100) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {userStats.tasksCompleted}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Tareas Completadas</div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">{getStreakEmoji(userStats.streak)}</div>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {userStats.streak}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Días de Racha</div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">💰</div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {balance ? Number(balance.formatted).toFixed(2) : '0.00'}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Tokens REMI</div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {userStats.weeklyGoals}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Metas Semanales</div>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Logros</h3>
        <div className="space-y-3">
          {userStats.tasksCompleted >= 1 && (
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎉</div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-100">Primera Tarea</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">¡Completaste tu primera tarea!</div>
              </div>
            </div>
          )}
          
          {userStats.streak >= 3 && (
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⚡</div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-100">Racha de 3 Días</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">¡Mantén el momentum!</div>
              </div>
            </div>
          )}
          
          {userStats.streak >= 7 && (
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔥</div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-100">Racha de 1 Semana</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">¡Eres consistente!</div>
              </div>
            </div>
          )}
          
          {userStats.tasksCompleted >= 10 && (
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📈</div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-100">10 Tareas Completadas</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">¡Estás progresando!</div>
              </div>
            </div>
          )}
          
          {userStats.weeklyGoals >= 1 && (
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🎯</div>
              <div>
                <div className="font-medium text-gray-800 dark:text-gray-100">Meta Semanal</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">¡Alcanzaste una meta semanal!</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Network Info */}
      <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {network === 'baseSepolia' ? 'Base Sepolia' : 'Celo Alfajores'}
            </span>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
        </div>
      </div>
    </div>
  );
} 