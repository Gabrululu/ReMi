'use client'

import { useState, useRef, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { User, Settings, LogOut, ChevronDown, Wallet, MessageCircle, Plus } from 'lucide-react'
import { ConnectionManager } from './ConnectionManager'

interface AvatarMenuProps {
  farcasterProfile?: any
  onDisconnect?: () => void
}

export function AvatarMenu({ farcasterProfile, onDisconnect }: AvatarMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showConnectionManager, setShowConnectionManager] = useState<'wallet' | 'farcaster' | null>(null)
  const { isConnected, address } = useAccount()
  const { disconnect } = useDisconnect()
  const menuRef = useRef<HTMLDivElement>(null)

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Obtener avatar o iniciales
  const getAvatarContent = () => {
    if (farcasterProfile?.pfpUrl) {
      return (
        <img 
          src={farcasterProfile.pfpUrl} 
          alt={farcasterProfile.displayName}
          className="w-8 h-8 rounded-full"
        />
      )
    }
    
    if (isConnected && address) {
      return (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
          {address.slice(2, 4).toUpperCase()}
        </div>
      )
    }

    return (
      <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
        <User className="w-4 h-4" />
      </div>
    )
  }

  // Obtener texto del botón
  const getButtonText = () => {
    if (farcasterProfile) return `@${farcasterProfile.username}`
    if (isConnected) return 'Conectado'
    return 'Perfil'
  }

  // Obtener dirección corta de wallet
  const getWalletShortAddr = () => {
    if (!address) return 'Wallet'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Manejar desconexión de wallet
  const handleWalletDisconnect = () => {
    disconnect()
    if (onDisconnect) onDisconnect()
    setIsOpen(false)
  }

  // Manejar desconexión de Farcaster
  const handleFarcasterDisconnect = () => {
    if (onDisconnect) onDisconnect()
    setIsOpen(false)
  }

  // Manejar configuración
  const handleSettings = () => {
    console.log('Abrir configuración...')
    // Aquí puedes abrir un modal de configuración
    setIsOpen(false)
  }

  // Manejar conexión de wallet
  const handleConnectWallet = () => {
    setShowConnectionManager('wallet')
    setIsOpen(false)
  }

  // Manejar conexión de Farcaster
  const handleConnectFarcaster = () => {
    setShowConnectionManager('farcaster')
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none"
      >
        {getAvatarContent()}
        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
          {getButtonText()}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
          {/* Profile Info */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {farcasterProfile?.displayName || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {farcasterProfile ? `@${farcasterProfile.username}` : (isConnected ? getWalletShortAddr() : 'No conectado')}
            </p>
          </div>

          {/* Connection Status */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400">Estado de conexión:</span>
            </div>
            <div className="mt-1 space-y-1">
              <div className={`flex items-center space-x-2 text-xs ${isConnected ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <Wallet className="w-3 h-3" />
                <span>Wallet: {isConnected ? 'Conectada' : 'Desconectada'}</span>
              </div>
                             <div className={`flex items-center space-x-2 text-xs ${farcasterProfile ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                 <MessageCircle className="w-3 h-3" />
                 <span>Farcaster: {farcasterProfile ? 'Conectado' : 'Desconectado'}</span>
               </div>
            </div>
          </div>

          {/* Connection Actions */}
          {!isConnected && (
            <button 
              onClick={handleConnectWallet}
              className="w-full text-left px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Conectar Wallet</span>
              </div>
            </button>
          )}

          {!farcasterProfile && (
            <button 
              onClick={handleConnectFarcaster}
              className="w-full text-left px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Conectar Farcaster</span>
              </div>
            </button>
          )}

          {/* Settings */}
          <button 
            onClick={handleSettings}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Configuración</span>
            </div>
          </button>

          {/* Disconnect Actions */}
          {(farcasterProfile || isConnected) && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
              {isConnected && (
                <button 
                  onClick={handleWalletDisconnect}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Desconectar Wallet</span>
                  </div>
                </button>
              )}
              
              {farcasterProfile && (
                <button 
                  onClick={handleFarcasterDisconnect}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <LogOut className="w-4 h-4" />
                    <span>Desconectar Farcaster</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Connection Manager Modal */}
      {showConnectionManager && (
        <ConnectionManager
          type={showConnectionManager}
          onClose={() => setShowConnectionManager(null)}
        />
      )}
    </div>
  )
}
