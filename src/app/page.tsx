'use client';

import React, { useState, useEffect } from 'react';
import { ConnectWallet } from '../../components/ConnectWallet';
import { WalletInstructions } from '../../components/WalletInstructions';
import { ThemeToggle } from '../../components/ThemeToggle';
import { Dashboard } from '../../components/Dashboard';
import { useAccount } from 'wagmi';

// Farcaster Mini App integration
declare global {
  interface Window {
    farcaster?: {
      ready: () => void;
      disableNativeGestures: () => void;
    };
  }
}

export default function HomePage() {
  const [showInstructions, setShowInstructions] = useState(false);
  const { isConnected } = useAccount();
  const [network, setNetwork] = useState<'baseSepolia' | 'celoAlfajores'>('baseSepolia');
  const [isAppReady, setIsAppReady] = useState(false);

  // Farcaster Mini App ready hook
  useEffect(() => {
    // Call ready when the app interface is loaded
    const callReady = () => {
      if (window.farcaster) {
        console.log('Farcaster SDK found, calling ready()');
        window.farcaster.ready();
        setIsAppReady(true);
      } else {
        console.log('Farcaster SDK not found, retrying...');
        // Retry after a longer delay if SDK is not available
        setTimeout(callReady, 500);
      }
    };

    // Initial call with short delay
    const timer = setTimeout(callReady, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-all duration-300">
      <div className={`${isConnected ? 'max-w-6xl' : 'max-w-md'} w-full`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 transition-all duration-300">
          {/* Header with Theme Toggle */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-end mb-4">
              <ThemeToggle />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">⏰ ReMi</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">Tu Agenda Social Web3</p>
          </div>
          
          {!isConnected ? (
            <>
              {/* Features - Only show when not connected */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl transition-all duration-300">
                  <span className="text-2xl mr-3">📅</span>
                  <span className="text-gray-700 dark:text-gray-200 transition-colors duration-300">Recordatorios personales y sociales</span>
                </div>
                <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl transition-all duration-300">
                  <span className="text-2xl mr-3">💰</span>
                  <span className="text-gray-700 dark:text-gray-200 transition-colors duration-300">Gana recompensas por cumplir tareas</span>
                </div>
                <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl transition-all duration-300">
                  <span className="text-2xl mr-3">🌟</span>
                  <span className="text-gray-700 dark:text-gray-200 transition-colors duration-300">Construye tu reputación Web3</span>
                </div>
              </div>

              {/* Wallet Connection */}
              <div className="mb-8">
                <ConnectWallet />
              </div>

              {/* Help Section - Only show when not connected */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 transition-colors duration-300">¿Nuevo en Web3?</h2>
                  <button
                    onClick={() => setShowInstructions(!showInstructions)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-300"
                  >
                    {showInstructions ? 'Ocultar' : 'Mostrar'} ayuda
                  </button>
                </div>
                
                {showInstructions && <WalletInstructions />}
                
                {!showInstructions && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-6 transition-all duration-300">
                    <div className="text-center">
                      <div className="text-4xl mb-4">🤝</div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 transition-colors duration-300">
                        ¿Primera vez en Web3?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">
                        No te preocupes, te guiamos paso a paso para conectar tu wallet y empezar a usar ReMi.
                      </p>
                      <button
                        onClick={() => setShowInstructions(true)}
                        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
                      >
                        Ver instrucciones
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer - Only show when not connected */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  <p>ReMi - Construyendo el futuro de la productividad Web3</p>
                  <div className="flex justify-center space-x-4 mt-2">
                    <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Documentación</a>
                    <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">Soporte</a>
                    <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300">GitHub</a>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Dashboard when connected */
            <Dashboard network={network} />
          )}
        </div>
      </div>
    </div>
  );
}