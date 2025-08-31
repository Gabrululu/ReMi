'use client'

import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { AppKitProvider } from '../../lib/appkit-config'

// ✅ Cargar el MiniAppProvider de Neynar solo en cliente
const MiniAppProvider = dynamic(
  () => import('@neynar/react').then(m => m.MiniAppProvider),
  { ssr: false }
)

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MiniAppProvider analyticsEnabled>
      <AppKitProvider>{children}</AppKitProvider>
    </MiniAppProvider>
  )
}
