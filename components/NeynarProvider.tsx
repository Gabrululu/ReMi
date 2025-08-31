'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Cargar Neynar de manera dinámica y segura
const MiniAppProvider = dynamic(
  () => import('@neynar/react').then(m => m.MiniAppProvider),
  { 
    ssr: false,
    loading: () => null
  }
)

interface NeynarProviderProps {
  children: React.ReactNode
}

export function NeynarProvider({ children }: NeynarProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Solo renderizar Neynar cuando esté montado en el cliente
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <MiniAppProvider analyticsEnabled>
      {children}
    </MiniAppProvider>
  )
}
