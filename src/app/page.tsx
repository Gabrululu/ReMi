'use client'
export const dynamic = 'force-dynamic'

import React, { useState, useEffect } from 'react'
import NextDynamic from 'next/dynamic'
import { useAccount } from 'wagmi'

import { ConnectWallet } from '../../components/ConnectWallet'
import { SignInWithFarcasterButton } from '../../components/SignInWithFarcasterButton'
import { AppHeader } from '../../components/AppHeader'
import { NetworkSelector } from '../../components/NetworkSelector'
import { Dashboard } from '../../components/Dashboard'
import { ClientOnly } from '../../components/ClientOnly'
import { useMiniAppEnv } from '../../hooks/useMiniAppEnv'

// Componentes de debug (solo en desarrollo)
import { FarcasterMiniAppStatus } from '../../components/FarcasterMiniAppStatus'
import { FarcasterMiniAppTester } from '../../components/FarcasterMiniAppTester'
import { SimpleFarcasterTest } from '../../components/SimpleFarcasterTest'

const WalletRuntime = NextDynamic(() => import('@/components/WalletRuntime'), {
  ssr: false,
})

export default function HomePage() {
  const [network, setNetwork] = useState<'baseSepolia' | 'celoAlfajores'>('baseSepolia')
  const [farcasterProfile, setFarcasterProfile] = useState<any>(null)
  const [showWalletConnect, setShowWalletConnect] = useState(false)
  
  const { isConnected } = useAccount()
  const { isMiniApp, context } = useMiniAppEnv()
  
  // Flag de debug
  const isDebug = process.env.NEXT_PUBLIC_FC_DEBUG === '1'

  // Cerrar modal cuando se conecte exitosamente
  useEffect(() => {
    if (isConnected && showWalletConnect) {
      setShowWalletConnect(false)
    }
  }, [isConnected, showWalletConnect])

  // Función para desconectar
  const handleDisconnect = () => {
    setFarcasterProfile(null)
    // Aquí puedes agregar lógica adicional de desconexión
  }

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
        {/* Inicialización de wagmi/wallets */}
        <WalletRuntime />

        {/* Loading state */}
        {isMiniApp === null && (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Cargando ReMi...</p>
            </div>
          </div>
        )}

        {/* Mini App dentro de Farcaster: render directo */}
        {isMiniApp && (
          <>
            {/* Header sticky */}
            <AppHeader 
              isMiniApp={isMiniApp} 
              network={network}
              farcasterProfile={farcasterProfile}
              onDisconnect={handleDisconnect}
            />
            
            <div className="container mx-auto p-4 max-w-6xl">
              {/* Título centrado */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  ⏰ ReMi
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">
                  Tu Agenda Social Web3
                </p>
              </div>

              {/* Selector de red centrado */}
              <NetworkSelector 
                network={network} 
                onNetworkChange={setNetwork} 
              />

              {/* Componentes de debug */}
              {isDebug && (
                <div className="mb-6 space-y-4">
                  <FarcasterMiniAppStatus />
                  <FarcasterMiniAppTester />
                  <SimpleFarcasterTest />
                </div>
              )}

              {/* Dashboard principal */}
              <Dashboard network={network} />
            </div>
          </>
        )}

        {/* Web (fuera del host): CTA simple */}
        {isMiniApp === false && (
          <>
            {/* Header sticky */}
            <AppHeader 
              isMiniApp={isMiniApp} 
              network={network}
              farcasterProfile={farcasterProfile}
              onDisconnect={handleDisconnect}
            />
            
            <div className="container mx-auto p-4 max-w-4xl">
              {/* Título centrado */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">
                  ⏰ ReMi
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-300">
                  Tu Agenda Social Web3
                </p>
              </div>

              {/* Selector de red centrado */}
              <NetworkSelector 
                network={network} 
                onNetworkChange={setNetwork} 
              />

              {/* Componentes de debug (solo en desarrollo) */}
              {isDebug && (
                <div className="mb-6 space-y-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    🔧 Debug Mode (NEXT_PUBLIC_FC_DEBUG=1)
                  </h3>
                  <FarcasterMiniAppStatus />
                  <FarcasterMiniAppTester />
                  <SimpleFarcasterTest />
                </div>
              )}

              {/* Contenido principal */}
              <main className="space-y-8">
                {!isConnected ? (
                  <>
                    {/* Hero Section */}
                    <div className="text-center py-12">
                      <div className="text-6xl mb-6">⏰</div>
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Tu Agenda Social Web3
                      </h1>
                      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                        Gestiona tu tiempo, cumple tus metas y gana recompensas Web3 
                        mientras construyes tu reputación social.
                      </p>
                      
                      {/* CTA Principal único */}
                      <div className="flex flex-col items-center space-y-4">
                        <SignInWithFarcasterButton />
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          o{' '}
                          <button 
                            onClick={() => setShowWalletConnect(true)}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Crear/Conectar wallet
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Connection Modal */}
                    {showWalletConnect && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                              Conectar Wallet
                            </h2>
                            <button
                              onClick={() => setShowWalletConnect(false)}
                              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                              ✕
                            </button>
                          </div>
                          <ConnectWallet />
                        </div>
                      </div>
                    )}

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="text-3xl mb-4">📅</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Recordatorios Inteligentes
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Nunca olvides tus tareas importantes con notificaciones personalizadas.
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="text-3xl mb-4">💰</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Recompensas Web3
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Gana tokens por completar tareas y mantener tu productividad.
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="text-3xl mb-4">🌟</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Reputación Social
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Construye tu credibilidad en la comunidad Web3.
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
                        <div className="text-3xl mb-4">🚀</div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Integración Farcaster
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          Conecta con tu red social descentralizada favorita.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Usuario conectado: Dashboard */}
                    <div className="mt-8">
                      <Dashboard network={network} />
                    </div>
                  </>
                )}
              </main>
            </div>
          </>
        )}
      </div>
    </ClientOnly>
  )
}