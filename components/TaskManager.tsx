'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { createRemiContract } from '../lib/contracts';
import { notificationService } from '../lib/notifications';
import { DashboardSkeleton } from './LoadingSkeleton';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  category: string;
  completed: boolean;
  createdAt: string;
  reminderTime?: string;
}

interface TaskManagerProps {
  network: 'baseSepolia' | 'celoAlfajores';
}

export function TaskManager({ network }: TaskManagerProps) {
  const { address } = useAccount();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM' as Task['priority'],
    category: '',
    reminderTime: ''
  });

  useEffect(() => {
    if (address) {
      loadTasks();
    }
  }, [address]);

  const loadTasks = () => {
    if (!address) return;
    
    const savedTasks = localStorage.getItem(`tasks_${address}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  };

  const saveTasks = (newTasks: Task[]) => {
    if (!address) return;
    
    localStorage.setItem(`tasks_${address}`, JSON.stringify(newTasks));
    setTasks(newTasks);
  };

  const addTask = () => {
    if (!formData.title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      category: formData.category || 'General',
      completed: false,
      createdAt: new Date().toISOString(),
      reminderTime: formData.reminderTime
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    
    // Schedule reminder if set
    if (formData.reminderTime) {
      scheduleReminder(newTask);
    }

    resetForm();
    setShowForm(false);
  };

  const updateTask = () => {
    if (!editingTask || !formData.title.trim()) return;

    const updatedTask: Task = {
      ...editingTask,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
      category: formData.category || 'General',
      reminderTime: formData.reminderTime
    };

    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id ? updatedTask : task
    );
    saveTasks(updatedTasks);

    resetForm();
    setEditingTask(null);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  const toggleTaskCompletion = async (task: Task) => {
    if (!address) return;

    setLoading(true);
    try {
      const contract = createRemiContract(network);
      const result = await contract.completeTask(parseInt(task.id), task.priority);
      
      if (result.success) {
        const updatedTasks = tasks.map(t => 
          t.id === task.id ? { ...t, completed: !t.completed } : t
        );
        saveTasks(updatedTasks);

        // Show notification
        await notificationService.showTaskCompleted(task.title, result.reward);
        
        // Trigger confetti for completion
        if (!task.completed) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      } else {
        console.error('Error completing task:', result.error);
      }
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleReminder = (task: Task) => {
    if (!task.reminderTime) return;

    const reminderDate = new Date(task.reminderTime);
    const now = new Date();
    const delay = reminderDate.getTime() - now.getTime();

    if (delay > 0) {
      setTimeout(() => {
        notificationService.showTaskReminder(task.title, task.dueDate);
      }, delay);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'MEDIUM',
      category: '',
      reminderTime: ''
    });
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      reminderTime: task.reminderTime || ''
    });
    setShowForm(true);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-500 text-white';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'URGENT': return '🚨';
      case 'HIGH': return '🔥';
      case 'MEDIUM': return '⚡';
      case 'LOW': return '🌱';
      default: return '📝';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || 
      (filter === 'pending' && !task.completed) || 
      (filter === 'completed' && task.completed);
    
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const categories = ['all', ...Array.from(new Set(tasks.map(task => task.category)))];

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestor de Tareas</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {tasks.length} tareas • {tasks.filter(t => t.completed).length} completadas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105"
        >
          ✨ Nueva Tarea
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {['all', 'pending', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  filter === status
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {status === 'all' ? 'Todas' : status === 'pending' ? 'Pendientes' : 'Completadas'}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las categorías' : category}
              </option>
            ))}
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm flex-1 min-w-[200px]"
          />
        </div>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-fade-in">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingTask ? 'Editar Tarea' : 'Nueva Tarea'}
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="¿Qué necesitas hacer?"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Detalles adicionales..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de vencimiento
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prioridad
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LOW">Baja 🌱</option>
                  <option value="MEDIUM">Media ⚡</option>
                  <option value="HIGH">Alta 🔥</option>
                  <option value="URGENT">Urgente 🚨</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Trabajo, Personal, Salud..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recordatorio
                </label>
                <input
                  type="datetime-local"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={editingTask ? updateTask : addTask}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
              >
                {editingTask ? 'Actualizar' : 'Crear'} Tarea
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
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

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || filter !== 'all' || categoryFilter !== 'all' 
                ? 'No se encontraron tareas' 
                : 'No hay tareas aún'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm || filter !== 'all' || categoryFilter !== 'all'
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Crea tu primera tarea para empezar a organizarte'}
            </p>
            {!searchTerm && filter === 'all' && categoryFilter === 'all' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
              >
                Crear Primera Tarea
              </button>
            )}
          </div>
        ) : (
          filteredTasks.map(task => (
            <div
              key={task.id}
              className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg ${
                task.completed ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <button
                  onClick={() => toggleTaskCompletion(task)}
                  className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-300 ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                  }`}
                >
                  {task.completed && '✓'}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className={`font-medium text-gray-900 dark:text-white ${
                        task.completed ? 'line-through' : ''
                      }`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className={`text-sm text-gray-600 dark:text-gray-300 mt-1 ${
                          task.completed ? 'line-through' : ''
                        }`}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {getPriorityIcon(task.priority)} {task.priority}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {task.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      {task.dueDate && (
                        <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                      {task.reminderTime && (
                        <span>⏰ {new Date(task.reminderTime).toLocaleString()}</span>
                      )}
                      <span>📅 {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => editTask(task)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-300"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors duration-300"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 