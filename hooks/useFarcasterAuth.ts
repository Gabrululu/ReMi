import { useState, useEffect } from 'react';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
}

interface UseFarcasterAuthReturn {
  user: FarcasterUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

declare global {
  interface Window {
    farcasterSDK?: {
      quickAuth: {
        fetch: (url: string) => Promise<Response>;
      };
      actions: {
        ready: () => void;
        signIn: (options: { nonce: string }) => Promise<void>;
      };
    };
  }
}

export function useFarcasterAuth(): UseFarcasterAuthReturn {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  const login = async () => {
    if (typeof window === 'undefined' || !window.farcasterSDK) {
      setError('SDK de Farcaster no disponible');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Inicializar el SDK
      window.farcasterSDK.actions.ready();

      // Intentar autenticación con Quick Auth
      const response = await window.farcasterSDK.quickAuth.fetch('/api/me');
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log('Usuario autenticado en Farcaster:', userData);
      } else {
        // Si Quick Auth falla, intentar Sign In manual
        const nonce = Math.random().toString(36).substring(7);
        await window.farcasterSDK.actions.signIn({ nonce });
        
        // Después del sign in, verificar nuevamente
        const retryResponse = await window.farcasterSDK.quickAuth.fetch('/api/me');
        if (retryResponse.ok) {
          const userData = await retryResponse.json();
          setUser(userData);
          console.log('Usuario autenticado después del sign in:', userData);
        } else {
          setError('No se pudo autenticar con Farcaster');
        }
      }
    } catch (err) {
      console.error('Error en autenticación de Farcaster:', err);
      setError('Error al conectar con Farcaster');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  // Auto-login cuando el componente se monta en un contexto de Farcaster
  useEffect(() => {
    const isInFarcaster = typeof window !== 'undefined' && 
                          (window.location.href.includes('farcaster.xyz') || 
                           window.navigator.userAgent.includes('Farcaster'));

    if (isInFarcaster && window.farcasterSDK && !user) {
      login();
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout
  };
} 