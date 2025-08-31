'use client'

import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { ConnectWallet } from './ConnectWallet'
import { WalletInstructions } from './WalletInstructions'
import { ThemeToggle } from './ThemeToggle'
import { Dashboard } from './Dashboard'
import { FarcasterDashboard } from './FarcasterDashboard'
import { ReownFarcasterDemo } from './ReownFarcasterDemo'

export default function HomePageContent() {
  const [showInstructions, setShowInstructions] = useState(false)
  const [showReownDemo, setShowReownDemo] = useState(false)
  const { isConnected } = useAccount()
  const [network, setNetwork] = useState<'baseSepolia' | 'celoAlfajores'>('baseSepolia')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-all duration-300">
      <div className={`${isConnected ? 'max-w-6xl' : 'max-w-md'} w-full`}>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-gray-900/50 p-8 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="flex items-center justify-end mb-4">
              <ThemeToggle />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">⏰ ReMi</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">Tu Agenda Social Web3</p>
          </div>

          {!isConnected ? (
            <>
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
                <div className="flex items-center p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl transition-all duration-300">
                  <span className="text-2xl mr-3">🐦</span>
                  <span className="text-gray-700 dark:text-gray-200 transition-colors duration-300">Integración completa con Farcaster</span>
                </div>
              </div>

              <div className="mb-8">
                <ConnectWallet />
              </div>

              <div className="mb-8">
                <button
                  onClick={() => setShowReownDemo(!showReownDemo)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {showReownDemo ? 'Ocultar' : 'Mostrar'} Demo Reown + Farcaster
                </button>
              </div>

              {showReownDemo && (
                <div className="mb-8">
                  <ReownFarcasterDemo />
                </div>
              )}

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
                      <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duración-300">
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
            <div className="space-y-6">
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={() => setNetwork('baseSepolia')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    network === 'baseSepolia'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Base Sepolia
                </button>
                <button
                  onClick={() => setNetwork('celoAlfajores')}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    network === 'celoAlfajores'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Celo Alfajores
                </button>
              </div>

              <Dashboard network={network} />

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  🚀 Integración con Farcaster
                </h2>
                <FarcasterDashboard />
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  🔗 Reown + Farcaster Integration
                </h2>
                <ReownFarcasterDemo />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


