'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { createRemiContract } from '../lib/contracts';
import { formatDate } from '../utils/time';
import { shareToFarcaster } from '../lib/share';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'task' | 'streak' | 'goal' | 'social' | 'special';
  unlocked: boolean;
  unlockedAt?: string;
  reward: number;
  progress?: number;
  maxProgress?: number;
}

interface AchievementsProps {
  network: 'baseSepolia' | 'celoAlfajores';
  userStats: any;
}

export function Achievements({ network, userStats }: AchievementsProps) {
  const { address } = useAccount();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [totalRewards, setTotalRewards] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  useEffect(() => {
    initializeAchievements();
  }, [userStats]);

  const initializeAchievements = () => {
    const baseAchievements: Achievement[] = [
      // Task Achievements
      {
        id: 'first_task',
        title: 'Primera Tarea',
        description: 'Completa tu primera tarea',
        icon: '🎉',
        category: 'task',
        unlocked: userStats?.tasksCompleted >= 1,
        unlockedAt: userStats?.tasksCompleted >= 1 ? new Date().toISOString() : undefined,
        reward: 10,
        progress: userStats?.tasksCompleted || 0,
        maxProgress: 1
      },
      {
        id: 'task_master_5',
        title: 'Aprendiz',
        description: 'Completa 5 tareas',
        icon: '🌱',
        category: 'task',
        unlocked: userStats?.tasksCompleted >= 5,
        unlockedAt: userStats?.tasksCompleted >= 5 ? new Date().toISOString() : undefined,
        reward: 25,
        progress: userStats?.tasksCompleted || 0,
        maxProgress: 5
      },
      {
        id: 'task_master_10',
        title: 'Intermedio',
        description: 'Completa 10 tareas',
        icon: '📈',
        category: 'task',
        unlocked: userStats?.tasksCompleted >= 10,
        unlockedAt: userStats?.tasksCompleted >= 10 ? new Date().toISOString() : undefined,
        reward: 50,
        progress: userStats?.tasksCompleted || 0,
        maxProgress: 10
      },
      {
        id: 'task_master_20',
        title: 'Avanzado',
        description: 'Completa 20 tareas',
        icon: '🚀',
        category: 'task',
        unlocked: userStats?.tasksCompleted >= 20,
        unlockedAt: userStats?.tasksCompleted >= 20 ? new Date().toISOString() : undefined,
        reward: 100,
        progress: userStats?.tasksCompleted || 0,
        maxProgress: 20
      },
      {
        id: 'task_master_50',
        title: 'Experto',
        description: 'Completa 50 tareas',
        icon: '⭐',
        category: 'task',
        unlocked: userStats?.tasksCompleted >= 50,
        unlockedAt: userStats?.tasksCompleted >= 50 ? new Date().toISOString() : undefined,
        reward: 250,
        progress: userStats?.tasksCompleted || 0,
        maxProgress: 50
      },
      {
        id: 'task_master_100',
        title: 'Maestro',
        description: 'Completa 100 tareas',
        icon: '👑',
        category: 'task',
        unlocked: userStats?.tasksCompleted >= 100,
        unlockedAt: userStats?.tasksCompleted >= 100 ? new Date().toISOString() : undefined,
        reward: 500,
        progress: userStats?.tasksCompleted || 0,
        maxProgress: 100
      },

      // Streak Achievements
      {
        id: 'streak_3',
        title: 'Momentum',
        description: 'Mantén una racha de 3 días',
        icon: '⚡',
        category: 'streak',
        unlocked: userStats?.streak >= 3,
        unlockedAt: userStats?.streak >= 3 ? new Date().toISOString() : undefined,
        reward: 30,
        progress: userStats?.streak || 0,
        maxProgress: 3
      },
      {
        id: 'streak_7',
        title: 'Consistente',
        description: 'Mantén una racha de 7 días',
        icon: '🔥',
        category: 'streak',
        unlocked: userStats?.streak >= 7,
        unlockedAt: userStats?.streak >= 7 ? new Date().toISOString() : undefined,
        reward: 75,
        progress: userStats?.streak || 0,
        maxProgress: 7
      },
      {
        id: 'streak_14',
        title: 'Dedicado',
        description: 'Mantén una racha de 14 días',
        icon: '💎',
        category: 'streak',
        unlocked: userStats?.streak >= 14,
        unlockedAt: userStats?.streak >= 14 ? new Date().toISOString() : undefined,
        reward: 150,
        progress: userStats?.streak || 0,
        maxProgress: 14
      },
      {
        id: 'streak_30',
        title: 'Legendario',
        description: 'Mantén una racha de 30 días',
        icon: '🏆',
        category: 'streak',
        unlocked: userStats?.streak >= 30,
        unlockedAt: userStats?.streak >= 30 ? new Date().toISOString() : undefined,
        reward: 500,
        progress: userStats?.streak || 0,
        maxProgress: 30
      },

      // Goal Achievements
      {
        id: 'first_goal',
        title: 'Meta Alcanzada',
        description: 'Completa tu primera meta semanal',
        icon: '🎯',
        category: 'goal',
        unlocked: userStats?.weeklyGoals >= 1,
        unlockedAt: userStats?.weeklyGoals >= 1 ? new Date().toISOString() : undefined,
        reward: 100,
        progress: userStats?.weeklyGoals || 0,
        maxProgress: 1
      },
      {
        id: 'goal_master_5',
        title: 'Planificador',
        description: 'Completa 5 metas semanales',
        icon: '📋',
        category: 'goal',
        unlocked: userStats?.weeklyGoals >= 5,
        unlockedAt: userStats?.weeklyGoals >= 5 ? new Date().toISOString() : undefined,
        reward: 300,
        progress: userStats?.weeklyGoals || 0,
        maxProgress: 5
      },
      {
        id: 'goal_master_10',
        title: 'Estratega',
        description: 'Completa 10 metas semanales',
        icon: '🎖️',
        category: 'goal',
        unlocked: userStats?.weeklyGoals >= 10,
        unlockedAt: userStats?.weeklyGoals >= 10 ? new Date().toISOString() : undefined,
        reward: 600,
        progress: userStats?.weeklyGoals || 0,
        maxProgress: 10
      },

      // Social Achievements
      {
        id: 'social_share',
        title: 'Compartidor',
        description: 'Comparte en Farcaster',
        icon: '📢',
        category: 'social',
        unlocked: false, // This will be unlocked when user shares
        reward: 5,
        progress: 0,
        maxProgress: 1
      },

      // Special Achievements
      {
        id: 'early_adopter',
        title: 'Early Adopter',
        description: 'Únete a ReMi en sus primeros días',
        icon: '🚀',
        category: 'special',
        unlocked: true, // Early users get this
        unlockedAt: new Date().toISOString(),
        reward: 50
      }
    ];

    setAchievements(baseAchievements);
    calculateTotalRewards(baseAchievements);
  };

  const calculateTotalRewards = (achievementsList: Achievement[]) => {
    const total = achievementsList
      .filter(a => a.unlocked)
      .reduce((sum, a) => sum + a.reward, 0);
    setTotalRewards(total);
  };

  const getCategoryColor = (category: Achievement['category']) => {
    switch (category) {
      case 'task': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200';
      case 'streak': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200';
      case 'goal': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200';
      case 'social': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'special': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  const getCategoryName = (category: Achievement['category']) => {
    switch (category) {
      case 'task': return 'Tareas';
      case 'streak': return 'Rachas';
      case 'goal': return 'Metas';
      case 'social': return 'Social';
      case 'special': return 'Especiales';
      default: return 'Otros';
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'unlocked') return achievement.unlocked;
    if (filter === 'locked') return !achievement.unlocked;
    return true;
  });

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const shareAchievement = async (a: Achievement) => {
    const copy = `${a.icon} ${a.title}\n\n${a.description}\n\n` +
      `Recompensa: ${a.reward} $REMI ✨\n` +
      `Categoría: ${getCategoryName(a.category)}\n` +
      `\nLogrado con ReMi ⏰✨\n#ReMi #Logro`
    const url = typeof window !== 'undefined' ? window.location.origin : undefined
    await shareToFarcaster({ text: copy, url })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Logros y Recompensas</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Desbloquea logros y gana tokens REMI
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {unlockedCount}/{totalCount}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Logros Desbloqueados</div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalRewards}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Tokens Ganados</div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Progreso</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {['all', 'unlocked', 'locked'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
              filter === f
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'unlocked' ? 'Desbloqueados' : 'Bloqueados'}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map(achievement => {
          const progressPercentage = achievement.progress && achievement.maxProgress 
            ? Math.min((achievement.progress / achievement.maxProgress) * 100, 100)
            : achievement.unlocked ? 100 : 0;

          return (
            <div
              key={achievement.id}
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all duration-300 ${
                achievement.unlocked 
                  ? 'ring-2 ring-green-500 shadow-lg' 
                  : 'opacity-75'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`text-3xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className={`font-medium text-gray-900 dark:text-white ${
                      achievement.unlocked ? '' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {achievement.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(achievement.category)}`}>
                      {getCategoryName(achievement.category)}
                    </span>
                    {achievement.unlocked && (
                      <span className="text-green-500">✅</span>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    achievement.unlocked 
                      ? 'text-gray-600 dark:text-gray-300' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {achievement.progress} / {achievement.maxProgress}
                        </span>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {Math.round(progressPercentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            achievement.unlocked 
                              ? 'bg-green-500' 
                              : progressPercentage >= 75 
                                ? 'bg-blue-500' 
                                : progressPercentage >= 50 
                                  ? 'bg-yellow-500' 
                                  : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Reward and Unlock Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">💰</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {achievement.reward} tokens
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {achievement.unlocked && achievement.unlockedAt && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(new Date(achievement.unlockedAt as any))}
                        </span>
                      )}
                      {achievement.unlocked && (
                        <button
                          onClick={() => shareAchievement(achievement)}
                          className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-xs font-medium"
                        >
                          Compartir 🚀
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No hay logros para mostrar
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {filter === 'unlocked' 
              ? 'Completa tareas y metas para desbloquear logros'
              : filter === 'locked'
              ? '¡Excelente! Has desbloqueado todos los logros disponibles'
              : 'Los logros aparecerán aquí'
            }
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          💡 Consejos para desbloquear logros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
          <div>
            <p className="font-medium mb-2">🎯 Completa tareas regularmente</p>
            <p>Mantén una racha diaria para desbloquear logros de consistencia</p>
          </div>
          <div>
            <p className="font-medium mb-2">📅 Establece metas semanales</p>
            <p>Las metas semanales te dan recompensas extra y logros especiales</p>
          </div>
          <div>
            <p className="font-medium mb-2">📢 Comparte en redes sociales</p>
            <p>Comparte tus logros en Farcaster para ganar tokens adicionales</p>
          </div>
          <div>
            <p className="font-medium mb-2">🌟 Persevera</p>
            <p>Los logros más valiosos requieren dedicación y tiempo</p>
          </div>
        </div>
      </div>
    </div>
  );
} 