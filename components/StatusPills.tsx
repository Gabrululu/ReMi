'use client'

import { useAccount } from 'wagmi'
import { Wifi, Wallet, User } from 'lucide-react'

interface StatusPillsProps {
  network: 'baseSepolia' | 'celoAlfajores'
  isMiniApp: boolean | null
  farcasterProfile?: any
}

export function StatusPills({ network, isMiniApp, farcasterProfile }: StatusPillsProps) {
  const { isConnected, address } = useAccount()

  // Obtener etiqueta de red
  const getNetworkLabel = () => {
    switch (network) {
      case 'baseSepolia':
        return 'Base'
      case 'celoAlfajores':
        return 'Celo'
      default:
        return 'Unknown'
    }
  }

  // Obtener dirección corta de wallet
  const getWalletShortAddr = () => {
    if (!address) return 'Wallet'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Solo mostrar Farcaster si NO es Mini App (evitar repetición)
  const shouldShowFarcaster = !isMiniApp && farcasterProfile

  return (
    <div className="hidden sm:flex items-center gap-3">
      {/* Red Status */}
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs border transition-colors
        bg-gray-200 text-gray-800 border-gray-300
        dark:bg-white/10 dark:text-white dark:border-white/20">
        <Wifi className="w-3 h-3 mr-1.5" />
        {getNetworkLabel()}
      </span>

      {/* Wallet Status - solo si está conectada */}
      {isConnected && (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs border transition-colors
          bg-gray-200 text-gray-800 border-gray-300
          dark:bg-white/10 dark:text-white dark:border-white/20">
          <Wallet className="w-3 h-3 mr-1.5" />
          {getWalletShortAddr()}
        </span>
      )}

      {/* Farcaster Status - solo si hay perfil y NO es Mini App */}
      {shouldShowFarcaster && (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs border transition-colors
          bg-gray-200 text-gray-800 border-gray-300
          dark:bg-white/10 dark:text-white dark:border-white/20">
          <User className="w-3 h-3 mr-1.5" />
          @{farcasterProfile.username}
        </span>
      )}
    </div>
  )
}
