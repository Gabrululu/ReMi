'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  completed: boolean;
  rewardAmount: number;
}

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onShare: (task: Task) => void;
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
};

const priorityEmojis = {
  LOW: '��',
  MEDIUM: '🟡',
  HIGH: '��',
  URGENT: '🔴',
};

export default function TaskCard({ task, onComplete, onShare }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onComplete(task.id);
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const isOverdue = new Date() > task.dueDate && !task.completed;

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
      task.completed 
        ? 'border-green-500 bg-green-50' 
        : isOverdue 
        ? 'border-red-500 bg-red-50' 
        : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`text-lg font-semibold ${
              task.completed ? 'line-through text-gray-500' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {priorityEmojis[task.priority]} {task.priority}
            </span>
          </div>
          
          {task.description && (
            <p className={`text-sm mb-3 ${
              task.completed ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>📅 {format(task.dueDate, 'PPP p', { locale: es })}</span>
            <span>💰 +{task.rewardAmount} REMI</span>
          </div>
        </div>
        
        {!task.completed && (
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className="ml-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isCompleting ? 'Completando...' : '✅ Completar'}
          </button>
        )}
      </div>
      
      {task.completed && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-green-600">
            <span>✅ Completado</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-600">
              +{task.rewardAmount} REMI ganados
            </span>
            <button
              onClick={() => onShare(task)}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
            >
              🚀 Compartir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}