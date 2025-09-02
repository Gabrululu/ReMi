'use client'

import { useState, useEffect } from 'react'
import { LogIn, User, ExternalLink, QrCode, Smartphone, X, Copy } from 'lucide-react'

interface FarcasterProfile {
  fid: number
  username: string
  displayName: string
  pfpUrl?: string
}

export function SignInWithFarcasterButton() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [profile, setProfile] = useState<FarcasterProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [siwfUrl, setSiwfUrl] = useState<string>('')
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')

  // Función para generar QR code usando la API de QR Server
  const generateQRCode = async (url: string) => {
    try {
      // Usar una API pública de QR code
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
      setQrCodeDataUrl(qrApiUrl)
    } catch (err) {
      console.error('Error generando QR code:', err)
      // Fallback: usar un QR code placeholder
      setQrCodeDataUrl('')
    }
  }

  const signInWithFarcaster = async () => {
    setIsConnecting(true)
    setError(null)
    setShowQR(true)

    try {
      // Generar URL de SIWF
      const url = new URL('https://warpcast.com/~/sign-in-with-farcaster')
      url.searchParams.set('client_id', process.env.NEXT_PUBLIC_FARCASTER_CLIENT_ID || 're-mi-app')
      url.searchParams.set('redirect_uri', `${window.location.origin}/api/auth/farcaster/callback`)
      url.searchParams.set('scope', 'read,write')
      url.searchParams.set('state', Math.random().toString(36).substring(7))
      
      const siwfUrlString = url.toString()
      setSiwfUrl(siwfUrlString)
      
      // Generar QR code con la URL
      await generateQRCode(siwfUrlString)

      // Escuchar mensajes de la ventana principal
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== 'https://warpcast.com') return
        
        if (event.data.type === 'farcaster-auth-success') {
          const { fid, username, displayName, pfpUrl } = event.data
          setProfile({
            fid,
            username,
            displayName,
            pfpUrl
          })
          setIsConnecting(false)
          setShowQR(false)
          window.removeEventListener('message', handleMessage)
        } else if (event.data.type === 'farcaster-auth-error') {
          setError(event.data.error || 'Error al conectar con Farcaster')
          setIsConnecting(false)
          setShowQR(false)
          window.removeEventListener('message', handleMessage)
        }
      }

      window.addEventListener('message', handleMessage)

      // Timeout de seguridad
      setTimeout(() => {
        if (isConnecting) {
          setError('Tiempo de conexión agotado. Intenta de nuevo.')
          setIsConnecting(false)
          setShowQR(false)
          window.removeEventListener('message', handleMessage)
        }
      }, 300000) // 5 minutos

    } catch (err: any) {
      setError(err.message || 'Error al conectar con Farcaster')
      setIsConnecting(false)
      setShowQR(false)
    }
  }

  const disconnect = () => {
    setProfile(null)
    setError(null)
    setShowQR(false)
    setSiwfUrl('')
    setQrCodeDataUrl('')
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(siwfUrl)
      // Opcional: mostrar toast de confirmación
    } catch (err) {
      console.error('Error al copiar link:', err)
    }
  }

  const closeQR = () => {
    setShowQR(false)
    setIsConnecting(false)
    setError(null)
    setSiwfUrl('')
    setQrCodeDataUrl('')
  }

  if (profile) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-purple-50 dark:bg-purple-900/20 px-3 py-2 rounded-lg">
          {profile.pfpUrl && (
            <img 
              src={profile.pfpUrl} 
              alt={profile.displayName}
              className="w-6 h-6 rounded-full"
            />
          )}
          <User className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
            @{profile.username}
          </span>
        </div>
        <button
          onClick={disconnect}
          className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Desconectar
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Modal QR Code */}
      {showQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">n</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Farcaster
                </span>
              </div>
              <button
                onClick={closeQR}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code */}
            <div className="text-center mb-6">
              <div className="bg-gray-100 dark:bg-gray-700 w-64 h-64 mx-auto rounded-lg flex items-center justify-center mb-4 relative">
                <div className="text-center">
                  <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center relative">
                    {qrCodeDataUrl ? (
                      <img 
                        src={qrCodeDataUrl} 
                        alt="QR Code para conectar con Farcaster"
                        className="w-40 h-40"
                      />
                    ) : (
                      <div className="w-40 h-40 bg-gray-200 rounded-lg flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    {/* Farcaster Logo en el centro */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">n</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Open link on mobile
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Open this link with your mobile phone with Farcaster installed to sign in.
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={copyLink}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                <span>Copy link</span>
              </button>
              <a
                href={siwfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <span>Go to Farcaster</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Loading State */}
            {isConnecting && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 text-purple-600">
                  <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  <span>Esperando conexión...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botón de conexión */}
      <button
        onClick={signInWithFarcaster}
        disabled={isConnecting}
        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm"
      >
        {isConnecting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <LogIn className="w-4 h-4" />
        )}
        <span>
          {isConnecting ? 'Conectando...' : 'Entrar con Farcaster'}
        </span>
        <ExternalLink className="w-3 h-3" />
      </button>
      
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
