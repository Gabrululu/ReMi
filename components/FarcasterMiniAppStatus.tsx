'use client';

import { useFarcasterMiniApp } from '../hooks/useFarcasterMiniApp';
import { CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';

export function FarcasterMiniAppStatus() {
  const { isReady, isMiniApp, error } = useFarcasterMiniApp();

  if (!isMiniApp) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">
            No estás en un contexto de Farcaster Mini App
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span className="text-red-700 dark:text-red-300">
            Error: {error}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2">
        {isReady ? (
          <CheckCircle className="w-4 h-4 text-green-600" />
        ) : (
          <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
        )}
        <span className="text-green-700 dark:text-green-300">
          {isReady ? '✅ Farcaster Mini App lista' : '⏳ Cargando Farcaster Mini App...'}
        </span>
      </div>
    </div>
  );
}
