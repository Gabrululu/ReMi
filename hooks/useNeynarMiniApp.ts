import { useMiniApp } from '@neynar/react';
import { useState, useEffect } from 'react';

interface NeynarUser {
  fid: number;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  followerCount?: number;
  followingCount?: number;
}

interface UseNeynarMiniAppReturn {
  user: NeynarUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isSDKLoaded: boolean;
  context: string | null;
  login: () => Promise<void>;
  logout: () => void;
}

export function useNeynarMiniApp(): UseNeynarMiniAppReturn {
  const { isSDKLoaded, context } = useMiniApp();
  const [user, setUser] = useState<NeynarUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const login = async () => {
    if (!isSDKLoaded) {
      setError('SDK de Neynar no está cargado');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Intentar obtener información del usuario usando el contexto de Mini App
      const response = await fetch('/api/me', {
        headers: {
          'x-farcaster-context': 'mini-app',
          'x-farcaster-auth': 'true'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log('Usuario autenticado con Neynar Mini App:', userData);
      } else {
        setError('No se pudo autenticar con Neynar Mini App');
      }
    } catch (err) {
      console.error('Error en autenticación de Neynar Mini App:', err);
      setError('Error al conectar con Neynar Mini App');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  // Auto-login cuando el SDK está cargado y estamos en contexto de Mini App
  useEffect(() => {
    if (isSDKLoaded && context === 'mini-app' && !user && !loading) {
      console.log('SDK de Neynar cargado, iniciando autenticación automática...');
      login();
    }
  }, [isSDKLoaded, context, user, loading]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isSDKLoaded,
    context,
    login,
    logout
  };
} 