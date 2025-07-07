'use client';

import React, { useState, useEffect } from 'react';

interface FarcasterWrapperProps {
  children: React.ReactNode;
}

export function FarcasterWrapper({ children }: FarcasterWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state while client is initializing
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando ReMi...</p>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
} 