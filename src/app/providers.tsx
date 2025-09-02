'use client'

import type { ReactNode } from 'react'
import { AppKitProviderWrapper } from '../../lib/appkit-config'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppKitProviderWrapper>
      {children}
    </AppKitProviderWrapper>
  )
}
