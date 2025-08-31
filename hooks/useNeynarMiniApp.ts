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
  const [user, setUser] = useState<NeynarUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Detectar contexto de Mini App
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isInFarcaster = window.location.href.includes('farcaster.xyz') || 
                         window.location.href.includes('miniapps') ||
                         window.navigator.userAgent.includes('Farcaster') ||
                         window.location.href.includes('warpcast.com');

    if (isInFarcaster) {
      setIsSDKLoaded(true);
      setContext('mini-app');
    }
  }, []);

  const login = async () => {
    if (!isSDKLoaded) {
      setError('No estás en un contexto de Farcaster Mini App');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simular datos de usuario para demo
      const mockUser: NeynarUser = {
        fid: 12345,
        username: 'remi_user',
        displayName: 'ReMi User',
        avatar: 'https://re-mi.vercel.app/icon.png',
        verified: true,
        followerCount: 156,
        followingCount: 89
      };
      
      setUser(mockUser);
      console.log('Usuario autenticado con Neynar Mini App:', mockUser);
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
      console.log('Contexto de Farcaster detectado, iniciando autenticación automática...');
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