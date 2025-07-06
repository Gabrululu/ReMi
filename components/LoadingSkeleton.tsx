'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2"
          style={{
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}

export function TaskSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded border-2"></div>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="flex space-x-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GoalSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-pulse">
      <div className="flex items-start space-x-3 mb-3">
        <div className="text-2xl">🎯</div>
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div className="bg-gray-300 dark:bg-gray-600 h-2 rounded-full w-1/3"></div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
      </div>
    </div>
  );
}

export function AchievementSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="text-3xl opacity-50">🏆</div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gray-300 dark:bg-gray-600 h-2 rounded-full w-1/2"></div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2">
        <div className="flex space-x-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-1 py-3 px-4">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Level and Progress Skeleton */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6">
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">👑</div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mx-auto"></div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-20"></div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div className="bg-gray-300 dark:bg-gray-500 h-2 rounded-full w-1/3"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
} 