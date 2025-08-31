'use client'
export const dynamic = 'force-dynamic'

import React from 'react'
import NextDynamic from 'next/dynamic'
import { useAccount } from 'wagmi'

const FarcasterWrapperNoSSR = NextDynamic<{ children: React.ReactNode }>(
  () =>
    import('@/components/FarcasterWrapper').then((m: any) =>
      (m.FarcasterWrapper ?? m.default) as React.ComponentType<{ children: React.ReactNode }>
    ),
  { ssr: false }
)

const Navbar = NextDynamic(() => import('@/components/NavbarNew'), {
  ssr: false,
  loading: () => <div className="h-16" />
})

const UserProfile = NextDynamic(
  () => import('@/components/UserProfile').then((m: any) => m.UserProfile ?? m.default),
  { ssr: false, loading: () => <div className="p-6">Cargando perfil…</div> }
)

export default function ProfilePage() {
  const { address } = useAccount()

  const content = !address ? (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">👤 Perfil Web3</h1>
        <p className="text-gray-600">Conecta tu wallet para ver tu perfil</p>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">👤 Perfil Web3</h1>

        {/* Perfil de Usuario de Farcaster */}
        <div className="mb-8">
          <UserProfile />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Wallet Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">💳 Wallet</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Dirección:</span>
                <span className="font-mono text-sm">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Red:</span>
                <span className="text-blue-600">Base Sepolia</span>
              </div>
            </div>
          </div>

          {/* Reputación */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🌟 Reputación</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Talent Score:</span>
                <span className="font-bold text-purple-600">1,337</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Self Claims:</span>
                <span className="text-green-600">5</span>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Estadísticas</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Tareas completadas:</span>
                <span className="font-bold text-green-600">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Racha actual:</span>
                <span className="font-bold text-orange-600">5 días</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">REMI ganados:</span>
                <span className="font-bold text-blue-600">248</span>
              </div>
            </div>
          </div>

          {/* Integraciones */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔗 Integraciones</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Farcaster</span>
                <span className="text-green-600">✅ Conectado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Talent Protocol</span>
                <span className="text-green-600">✅ Conectado</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Self Protocol</span>
                <span className="text-green-600">✅ Conectado</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
  
  return <FarcasterWrapperNoSSR>{content}</FarcasterWrapperNoSSR>
}
