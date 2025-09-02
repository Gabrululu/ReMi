'use client'

import { useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import { ConnectWallet } from './ConnectWallet'
import { SignInWithFarcasterButton } from './SignInWithFarcasterButton'

interface ConnectionManagerProps {
  type: 'wallet' | 'farcaster'
  onClose: () => void
}

export function ConnectionManager({ type, onClose }: ConnectionManagerProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const { isConnected } = useAccount()

  const handleWalletConnect = () => {
    setIsConnecting(true)
    // El componente ConnectWallet manejará la conexión con Reown AppKit
  }

  const handleFarcasterConnect = () => {
    setIsConnecting(true)
    // El componente SignInWithFarcasterButton manejará la conexión con SIWF
  }

  const handleSuccess = () => {
    setIsConnecting(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {type === 'wallet' ? 'Conectar Wallet' : 'Conectar Farcaster'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {type === 'wallet' ? (
            <ConnectWallet />
          ) : (
            <SignInWithFarcasterButton />
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
