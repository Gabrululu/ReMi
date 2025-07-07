'use client';

import { useEffect } from 'react';
import { useNeynarMiniApp } from '../hooks/useNeynarMiniApp';
import { useAccount } from 'wagmi';

interface FarcasterAuthProps {
  children: React.ReactNode;
}

export function FarcasterAuth({ children }: FarcasterAuthProps) {
  const { address, isConnected } = useAccount();
  const { user: farcasterUser, loading: farcasterLoading, error: farcasterError, login: farcasterLogin, isAuthenticated: isFarcasterAuthenticated, isSDKLoaded, context } = useNeynarMiniApp();

  // Auto-conectar Farcaster cuando la wallet está conectada o cuando el SDK de Neynar está listo
  useEffect(() => {
    if ((isConnected && address && !isFarcasterAuthenticated && !farcasterLoading) || 
        (isSDKLoaded && context === 'mini-app' && !isFarcasterAuthenticated && !farcasterLoading)) {
      console.log('Iniciando autenticación de Farcaster Mini App...');
      farcasterLogin();
    }
  }, [isConnected, address, isFarcasterAuthenticated, farcasterLoading, farcasterLogin, isSDKLoaded, context]);

  // Mostrar estado de autenticación
  const renderAuthStatus = () => {
    if (farcasterLoading) {
      return (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          🔄 Conectando con Farcaster...
        </div>
      );
    }

    if (farcasterError) {
      return (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ❌ Error: {farcasterError}
        </div>
      );
    }

    if (isConnected && isFarcasterAuthenticated) {
      return (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          ✅ Conectado: {farcasterUser?.displayName} (@{farcasterUser?.username})
        </div>
      );
    }

    return null;
  };

  return (
    <div>
      {renderAuthStatus()}
      {children}
    </div>
  );
} 