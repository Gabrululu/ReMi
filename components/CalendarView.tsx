'use client';

import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  completed: boolean;
  category: string;
}

interface CalendarViewProps {
  tasks: Task[];
  onDateSelect?: (date: Date) => void;
  onTaskClick?: (task: Task) => void;
}

export function CalendarView({ tasks, onDateSelect, onTaskClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week'>('month');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getWeekDays = () => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days;
  };

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return tasks.filter(task => task.dueDate === dateString);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderMonthView = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
    const days: JSX.Element[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"></div>);
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayTasks = getTasksForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      days.push(
        <div
          key={day}
          className={`
            h-24 border border-gray-200 dark:border-gray-700 p-1 cursor-pointer
            transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20
            ${isToday ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
            ${isSelected ? 'ring-2 ring-blue-500' : ''}
          `}
          onClick={() => {
            setSelectedDate(date);
            onDateSelect?.(date);
          }}
        >
          <div className="flex justify-between items-start">
            <span className={`
              text-sm font-medium
              ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}
            `}>
              {day}
            </span>
            {dayTasks.length > 0 && (
              <span className="text-xs bg-blue-500 text-white rounded-full px-1 min-w-[16px] text-center">
                {dayTasks.length}
              </span>
            )}
          </div>
          
          <div className="mt-1 space-y-1">
            {dayTasks.slice(0, 2).map(task => (
              <div
                key={task.id}
                className={`
                  text-xs p-1 rounded truncate cursor-pointer
                  ${task.completed ? 'opacity-50 line-through' : ''}
                  ${getPriorityColor(task.priority)} text-white
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick?.(task);
                }}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
            {dayTasks.length > 2 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                +{dayTasks.length - 2} más
              </div>
            )}
          </div>
        </div>
      );
    }
    
    return days.length > 0 ? <>{days}</> : null;
  };

  const renderWeekView = () => {
    const weekDays: JSX.Element[] = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dayTasks = getTasksForDate(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      
      weekDays.push(
        <div
          key={i}
          className={`
            flex-1 border border-gray-200 dark:border-gray-700 p-2 cursor-pointer
            transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20
            ${isToday ? 'bg-blue-100 dark:bg-blue-900/30' : ''}
            ${isSelected ? 'ring-2 ring-blue-500' : ''}
          `}
          onClick={() => {
            setSelectedDate(date);
            onDateSelect?.(date);
          }}
        >
          <div className="text-center mb-2">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getWeekDays()[i]}
            </div>
            <div className={`
              text-lg font-bold
              ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}
            `}>
              {date.getDate()}
            </div>
          </div>
          
          <div className="space-y-1">
            {dayTasks.map(task => (
              <div
                key={task.id}
                className={`
                  text-xs p-1 rounded truncate cursor-pointer
                  ${task.completed ? 'opacity-50 line-through' : ''}
                  ${getPriorityColor(task.priority)} text-white
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  onTaskClick?.(task);
                }}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return weekDays.length > 0 ? <>{weekDays}</> : null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Calendario
          </h3>
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                view === 'month'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                view === 'week'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Semana
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ←
          </button>
          <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[120px] text-center">
            {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      {view === 'month' ? (
        <div className="grid grid-cols-7 gap-1">
          {/* Week day headers */}
          {getWeekDays().map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {renderMonthView()}
        </div>
      ) : (
        <div className="flex space-x-1">
          {renderWeekView()}
        </div>
      )}

      {/* Selected date tasks */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Tareas para {selectedDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          
          <div className="space-y-2">
            {getTasksForDate(selectedDate).length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No hay tareas programadas para este día
              </p>
            ) : (
              getTasksForDate(selectedDate).map(task => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                  <span className={`flex-1 text-sm ${task.completed ? 'line-through opacity-50' : ''}`}>
                    {task.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {task.category}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
} 