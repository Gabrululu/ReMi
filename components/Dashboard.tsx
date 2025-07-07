'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { createRemiContract } from '../lib/contracts';
import { TaskManager } from './TaskManager';
import { WeeklyGoals } from './WeeklyGoals';
import { Achievements } from './Achievements';
import { UserStats } from './UserStats';
import { Confetti } from './Confetti';
import { AnimatedBadge } from './AnimatedBadge';
import { ProgressChart } from './ProgressChart';
import { CalendarView } from './CalendarView';
import { DashboardSkeleton } from './LoadingSkeleton';

interface DashboardProps {
  network: 'baseSepolia' | 'celoAlfajores';
}

type TabType = 'tasks' | 'goals' | 'achievements' | 'stats' | 'calendar' | 'analytics';

export function Dashboard({ network }: DashboardProps) {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && address) {
      loadUserStats();
      const savedTasks = localStorage.getItem(`tasks_${address}`);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    }
  }, [address]);

  const loadUserStats = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const contract = createRemiContract(network);
      const stats = await contract.getUserStats(address);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const tabs = [
    {
      id: 'tasks' as TabType,
      name: 'Tareas',
      icon: '📝',
      description: 'Gestiona tus recordatorios'
    },
    {
      id: 'goals' as TabType,
      name: 'Metas',
      icon: '🎯',
      description: 'Metas semanales'
    },
    {
      id: 'calendar' as TabType,
      name: 'Calendario',
      icon: '📅',
      description: 'Vista de calendario'
    },
    {
      id: 'achievements' as TabType,
      name: 'Logros',
      icon: '🏆',
      description: 'Recompensas y logros'
    },
    {
      id: 'analytics' as TabType,
      name: 'Analytics',
      icon: '📊',
      description: 'Gráficos y estadísticas'
    },
    {
      id: 'stats' as TabType,
      name: 'Perfil',
      icon: '👤',
      description: 'Tu progreso'
    }
  ];

  const getTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TaskManager network={network} />;
      case 'goals':
        return <WeeklyGoals network={network} />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'achievements':
        return <Achievements network={network} userStats={userStats} />;
      case 'analytics':
        return <AnalyticsView userStats={userStats} tasks={tasks} />;
      case 'stats':
        return <UserStats userStats={userStats} network={network} loading={loading} />;
      default:
        return <TaskManager network={network} />;
    }
  };

  // Analytics component
  const AnalyticsView = ({ userStats, tasks }: { userStats: any, tasks: any[] }) => {
    if (loading) return <DashboardSkeleton />;

    const progressData = [
      {
        label: 'Tareas Completadas',
        value: userStats?.tasksCompleted || 0,
        maxValue: 100,
        color: '#10B981',
        icon: '✅'
      },
      {
        label: 'Días de Racha',
        value: userStats?.streak || 0,
        maxValue: 30,
        color: '#F59E0B',
        icon: '🔥'
      },
      {
        label: 'Metas Semanales',
        value: userStats?.weeklyGoals || 0,
        maxValue: 10,
        color: '#8B5CF6',
        icon: '🎯'
      },
      {
        label: 'Tokens REMI',
        value: userStats?.balance || 0,
        maxValue: 1000,
        color: '#3B82F6',
        icon: '💰'
      }
    ];

    const taskCategories = tasks.reduce((acc: any, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    const categoryData = Object.entries(taskCategories).map(([category, count]) => ({
      label: category,
      value: count as number,
      maxValue: Math.max(...Object.values(taskCategories) as number[]),
      color: ['#EF4444', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'][Math.floor(Math.random() * 6)],
      icon: '📁'
    }));

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
            <p className="text-gray-600 dark:text-gray-300">Análisis detallado de tu productividad</p>
          </div>
          <button
            onClick={triggerConfetti}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
          >
            🎉 Celebrar
          </button>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProgressChart 
            data={progressData} 
            title="Progreso General" 
            type="bar" 
            animate={true} 
          />
          <ProgressChart 
            data={categoryData} 
            title="Tareas por Categoría" 
            type="radial" 
            animate={true} 
          />
        </div>

        {/* Animated Badges */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Logros Destacados
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AnimatedBadge
              icon="🎉"
              title="Primera Tarea"
              description="Completa tu primera tarea"
              color="#10B981"
              isUnlocked={userStats?.tasksCompleted >= 1}
              progress={userStats?.tasksCompleted || 0}
              maxProgress={1}
            />
            <AnimatedBadge
              icon="🔥"
              title="Racha de 3 Días"
              description="Mantén consistencia"
              color="#F59E0B"
              isUnlocked={userStats?.streak >= 3}
              progress={userStats?.streak || 0}
              maxProgress={3}
            />
            <AnimatedBadge
              icon="🎯"
              title="Meta Semanal"
              description="Alcanza una meta semanal"
              color="#8B5CF6"
              isUnlocked={userStats?.weeklyGoals >= 1}
              progress={userStats?.weeklyGoals || 0}
              maxProgress={1}
            />
            <AnimatedBadge
              icon="💰"
              title="100 Tokens"
              description="Acumula 100 tokens REMI"
              color="#3B82F6"
              isUnlocked={userStats?.balance >= 100}
              progress={userStats?.balance || 0}
              maxProgress={100}
            />
          </div>
        </div>

        {/* Line Chart for Trends */}
        <ProgressChart 
          data={progressData.slice(0, 3)} 
          title="Tendencias de Productividad" 
          type="line" 
          animate={true} 
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Confetti Effect */}
      <Confetti isActive={showConfetti} />

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-xl mb-1">{tab.icon}</span>
              <span>{tab.name}</span>
              <span className="text-xs opacity-75">{tab.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-fade-in">
        {getTabContent()}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <button
            onClick={() => setActiveTab('tasks')}
            className="flex flex-col items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-300"
          >
            <span className="text-2xl mb-1">➕</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Nueva Tarea</span>
          </button>
          
          <button
            onClick={() => setActiveTab('goals')}
            className="flex flex-col items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300"
          >
            <span className="text-2xl mb-1">🎯</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Nueva Meta</span>
          </button>
          
          <button
            onClick={() => setActiveTab('calendar')}
            className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-300"
          >
            <span className="text-2xl mb-1">📅</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Calendario</span>
          </button>
          
          <button
            onClick={() => setActiveTab('achievements')}
            className="flex flex-col items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-all duration-300"
          >
            <span className="text-2xl mb-1">🏆</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Logros</span>
          </button>
          
          <button
            onClick={() => setActiveTab('analytics')}
            className="flex flex-col items-center p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all duration-300"
          >
            <span className="text-2xl mb-1">📊</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Analytics</span>
          </button>
          
          <button
            onClick={() => setActiveTab('stats')}
            className="flex flex-col items-center p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-all duration-300"
          >
            <span className="text-2xl mb-1">👤</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Perfil</span>
          </button>
        </div>
      </div>

      {/* Network Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {network === 'baseSepolia' ? 'Base Sepolia' : 'Celo Alfajores'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Red activa para transacciones
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Wallet conectada
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 