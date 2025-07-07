'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { createRemiContract } from '../lib/contracts';
import { notificationService } from '../lib/notifications';
import { DashboardSkeleton } from './LoadingSkeleton';

interface Goal {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  completed: boolean;
  reward: number;
  createdAt: string;
}

interface WeeklyGoalsProps {
  network: 'baseSepolia' | 'celoAlfajores';
}

export function WeeklyGoals({ network }: WeeklyGoalsProps) {
  const { address } = useAccount();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetValue: 1,
    unit: '',
    deadline: '',
    reward: 100
  });

  useEffect(() => {
    if (address && typeof window !== 'undefined') {
      const savedGoals = localStorage.getItem(`goals_${address}`);
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
    }
  }, [address]);

  const saveGoals = (newGoals: Goal[]) => {
    if (!address || typeof window === 'undefined') return;
    localStorage.setItem(`goals_${address}`, JSON.stringify(newGoals));
    setGoals(newGoals);
  };

  const addGoal = () => {
    if (!formData.title.trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      targetValue: formData.targetValue,
      currentValue: 0,
      unit: formData.unit,
      deadline: formData.deadline,
      completed: false,
      reward: formData.reward,
      createdAt: new Date().toISOString()
    };

    const updatedGoals = [...goals, newGoal];
    saveGoals(updatedGoals);
    resetForm();
    setShowForm(false);
  };

  const updateGoal = () => {
    if (!editingGoal || !formData.title.trim()) return;

    const updatedGoal: Goal = {
      ...editingGoal,
      title: formData.title,
      description: formData.description,
      targetValue: formData.targetValue,
      unit: formData.unit,
      deadline: formData.deadline,
      reward: formData.reward
    };

    const updatedGoals = goals.map(goal => 
      goal.id === editingGoal.id ? updatedGoal : goal
    );
    saveGoals(updatedGoals);

    resetForm();
    setEditingGoal(null);
  };

  const deleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
  };

  const updateProgress = (goalId: string, newValue: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, currentValue: newValue };
        
        // Check if goal is completed
        if (newValue >= goal.targetValue && !goal.completed) {
          updatedGoal.completed = true;
          completeGoal(updatedGoal);
        }
        
        return updatedGoal;
      }
      return goal;
    });
    saveGoals(updatedGoals);
  };

  const completeGoal = async (goal: Goal) => {
    if (!address) return;

    setLoading(true);
    try {
      const contract = createRemiContract(network);
      const result = await contract.completeWeeklyGoal(parseInt(goal.id));
      
      if (result.success) {
        // Show notification
        await notificationService.showGoalCompleted(goal.title, result.reward);
        
        // Trigger confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        console.error('Error completing goal:', result.error);
      }
    } catch (error) {
      console.error('Error completing goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetValue: 1,
      unit: '',
      deadline: '',
      reward: 100
    });
  };

  const editGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      targetValue: goal.targetValue,
      unit: goal.unit,
      deadline: goal.deadline,
      reward: goal.reward
    });
    setShowForm(true);
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getGoalStatus = (goal: Goal) => {
    if (goal.completed) return 'Completada';
    if (new Date(goal.deadline) < new Date()) return 'Vencida';
    return 'En progreso';
  };

  const getStatusColor = (goal: Goal) => {
    if (goal.completed) return 'text-green-600 dark:text-green-400';
    if (new Date(goal.deadline) < new Date()) return 'text-red-600 dark:text-red-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Metas Semanales</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {goals.length} metas • {goals.filter(g => g.completed).length} completadas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-pink-700 transform hover:scale-105"
        >
          🎯 Nueva Meta
        </button>
      </div>

      {/* Goal Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingGoal ? 'Editar Meta' : 'Nueva Meta Semanal'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="¿Qué quieres lograr esta semana?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe tu meta en detalle..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meta objetivo
                </label>
                <input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: parseInt(e.target.value) || 1 })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Unidad
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="horas, páginas, km..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recompensa (tokens)
                </label>
                <input
                  type="number"
                  value={formData.reward}
                  onChange={(e) => setFormData({ ...formData, reward: parseInt(e.target.value) || 100 })}
                  min="10"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fecha límite
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={editingGoal ? updateGoal : addGoal}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
              >
                {editingGoal ? 'Actualizar' : 'Crear'} Meta
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingGoal(null);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-float">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay metas semanales
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Crea tu primera meta semanal para empezar a trabajar hacia tus objetivos
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
            >
              Crear Primera Meta
            </button>
          </div>
        ) : (
          goals.map(goal => {
            const progressPercentage = getProgressPercentage(goal);
            const progressColor = getProgressColor(progressPercentage);
            const status = getGoalStatus(goal);
            const statusColor = getStatusColor(goal);
            
            return (
              <div
                key={goal.id}
                className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${
                  goal.completed ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">🎯</span>
                      <h4 className={`text-lg font-semibold text-gray-900 dark:text-white ${
                        goal.completed ? 'line-through' : ''
                      }`}>
                        {goal.title}
                      </h4>
                      {goal.completed && (
                        <span className="text-green-500 text-xl">✅</span>
                      )}
                    </div>
                    
                    {goal.description && (
                      <p className={`text-gray-600 dark:text-gray-300 ${
                        goal.completed ? 'line-through' : ''
                      }`}>
                        {goal.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                      {status}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {goal.reward} tokens
                    </span>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progreso
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {goal.currentValue}/{goal.targetValue} {goal.unit}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${progressColor}`}
                      style={{ width: `${progressPercentage}%` }}
                    >
                      {/* Animated progress fill */}
                      {!goal.completed && progressPercentage > 0 && (
                        <div 
                          className="h-full w-full opacity-30"
                          style={{
                            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                            animation: 'shimmer 2s infinite'
                          }}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(progressPercentage)}% completado
                    </span>
                  </div>
                </div>

                {/* Progress Update */}
                {!goal.completed && (
                  <div className="flex items-center space-x-3 mb-4">
                    <input
                      type="number"
                      min="0"
                      max={goal.targetValue}
                      value={goal.currentValue}
                      onChange={(e) => updateProgress(goal.id, parseInt(e.target.value) || 0)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder={`Actualizar progreso (0-${goal.targetValue})`}
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {goal.unit}
                    </span>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    {goal.deadline && (
                      <span>📅 {new Date(goal.deadline).toLocaleDateString()}</span>
                    )}
                    <span>📅 {new Date(goal.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => editGoal(goal)}
                      className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium transition-colors duration-300"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors duration-300"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Stats Summary */}
      {goals.length > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Resumen de Metas
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {goals.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {goals.filter(g => g.completed).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Completadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {goals.filter(g => !g.completed && new Date(g.deadline) >= new Date()).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">En progreso</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {goals.filter(g => !g.completed && new Date(g.deadline) < new Date()).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Vencidas</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 