'use client'

import { ThemeToggle } from './ThemeToggle'
import { SignInWithFarcasterButton } from './SignInWithFarcasterButton'
import { StatusPills } from './StatusPills'
import { AvatarMenu } from './AvatarMenu'

interface AppHeaderProps {
  isMiniApp: boolean | null
  network: 'baseSepolia' | 'celoAlfajores'
  farcasterProfile?: any
  onDisconnect?: () => void
}

export function AppHeader({ isMiniApp, network, farcasterProfile, onDisconnect }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 grid grid-cols-3 items-center gap-3">
        {/* IZQ: reservado (nav móvil o logo pequeño) */}
        <div className="flex items-center">
          <div className="text-2xl">📆</div>
        </div>

        {/* CENTRO: vacío (título vive en la page) */}
        <div />

        {/* DER: acciones compactas */}
        <div className="flex items-center justify-end gap-6">
          {/* Status pills (compactas) - primero para evitar superposición */}
          <StatusPills 
            network={network} 
            isMiniApp={isMiniApp} 
            farcasterProfile={farcasterProfile}
          />

          {/* Theme toggle con separación explícita */}
          <div className="flex items-center">
            <ThemeToggle aria-label="Cambiar tema" />
            <div className="w-3" />
          </div>

          {/* El botón SIWN ahora está en el menú desplegable de Avatar */}

          {/* Avatar (abre dropdown con acciones) */}
          <AvatarMenu 
            farcasterProfile={farcasterProfile}
            onDisconnect={onDisconnect}
          />
        </div>
      </div>
    </header>
  )
}
