'use client'

import { useEffect } from 'react'
import { useAccount, useConnect } from 'wagmi'

// Evita doble inicialización en hot-reload
let initialized = false

export default function WalletRuntime() {
  // Tocar wagmi hooks en el runtime dispara la inicialización temprana
  const { isConnected } = useAccount()
  const { connectors } = useConnect()

  useEffect(() => {
    if (initialized) return
    if (typeof window === 'undefined') return

    // No recreamos la config aquí para evitar conflictos con el provider global.
    // El simple montaje + acceso a hooks permite que Wagmi intente reconectar (reconnectOnMount).
    initialized = true
  }, [])

  return null
}
