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
      context?: string;
      quickAuth: {
        fetch: (url: string) => Promise<Response>;
      };
      actions: {
        ready: () => void;
        signIn: (options: { nonce: string }) => Promise<void>;
        fetch: (url: string) => Promise<Response>;
      };
      wallet?: {
        ethProvider?: any;
        getAddress?: () => Promise<string | null>;
      };
      events?: {
        on: (event: string, callback: (data: any) => void) => void;
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
      // Inicializar el SDK de Mini App
      await window.farcasterSDK.actions.ready();

      // Verificar si estamos en contexto de Mini App
      const isMiniApp = window.farcasterSDK.context === 'mini-app';
      console.log('Contexto de Mini App detectado:', isMiniApp);

      // Intentar autenticación con Quick Auth usando el fetch autenticado del SDK
      const response = await window.farcasterSDK.actions.fetch('/api/me');
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log('Usuario autenticado en Farcaster Mini App:', userData);
        
        // Obtener la dirección de la wallet si está disponible
        if (window.farcasterSDK.wallet?.getAddress) {
          try {
            const walletAddress = await window.farcasterSDK.wallet.getAddress();
            if (walletAddress) {
              console.log('Wallet address obtenida:', walletAddress);
            }
          } catch (walletError) {
            console.log('No se pudo obtener la dirección de la wallet:', walletError);
          }
        }
      } else {
        // Si la autenticación falla, intentar Sign In manual
        const nonce = Math.random().toString(36).substring(7);
        await window.farcasterSDK.actions.signIn({ nonce });
        
        // Después del sign in, verificar nuevamente
        const retryResponse = await window.farcasterSDK.actions.fetch('/api/me');
        if (retryResponse.ok) {
          const userData = await retryResponse.json();
          setUser(userData);
          console.log('Usuario autenticado después del sign in:', userData);
        } else {
          setError('No se pudo autenticar con Farcaster Mini App');
        }
      }
    } catch (err) {
      console.error('Error en autenticación de Farcaster Mini App:', err);
      setError('Error al conectar con Farcaster Mini App');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  // Auto-login cuando el componente se monta en un contexto de Farcaster Mini App
  useEffect(() => {
    const isInFarcaster = typeof window !== 'undefined' && 
                          (window.location.href.includes('farcaster.xyz') || 
                           window.navigator.userAgent.includes('Farcaster') ||
                           window.location.href.includes('miniapps'));

    // Detectar si estamos en un Mini App context
    const isMiniAppContext = typeof window !== 'undefined' && 
                            window.farcasterSDK?.context === 'mini-app';

    if ((isInFarcaster || isMiniAppContext) && window.farcasterSDK && !user) {
      console.log('Detectado contexto de Farcaster Mini App, iniciando autenticación...');
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