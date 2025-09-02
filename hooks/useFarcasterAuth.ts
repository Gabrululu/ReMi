'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  followerCount?: number;
  followingCount?: number;
}

interface UseFarcasterAuthReturn {
  user: FarcasterUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isInFarcaster: boolean;
  login: () => Promise<void>;
  logout: () => void;
  checkFarcasterAuth: () => Promise<void>;
  token?: string | null;
}

export function useFarcasterAuth(): UseFarcasterAuthReturn {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInFarcaster, setIsInFarcaster] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Detectar si estamos en contexto de Farcaster (Mini App) usando el SDK oficial
  const detectFarcasterContext = useCallback(async () => {
    if (typeof window === 'undefined') return false;
    try {
      const { sdk } = await import('@farcaster/miniapp-sdk');
      const inside = await sdk.isInMiniApp();
      setIsInFarcaster(inside);
      return inside;
    } catch (_) {
      // Fallback heurístico si no se pudo cargar el SDK
      const inside = window.location.href.includes('farcaster.xyz') ||
                    window.navigator.userAgent.includes('Farcaster');
      setIsInFarcaster(inside);
      return inside;
    }
  }, []);

  // Verificar autenticación de Farcaster
  const checkFarcasterAuth = useCallback(async () => {
    const inside = await detectFarcasterContext();
    if (!inside) return;

    setLoading(true);
    setError(null);

    try {
      const { sdk } = await import('@farcaster/miniapp-sdk');

      // 1) Intentar Quick Auth (autenticación automática) -> devuelve JWT + usuario
      // La API exacta puede variar; probamos dos convenciones comunes y hacemos fallback a context
      let authedUser: FarcasterUser | null = null;

      try {
        // Convención A: sdk.quickAuth.signIn() devuelve { user, token }
        // @ts-ignore - dependemos de runtime
        if (sdk.quickAuth?.signIn) {
          // @ts-ignore
          const session = await sdk.quickAuth.signIn();
          const u = session?.user || session?.data?.user;
          const t = session?.token || session?.data?.token;
          if (u?.fid) {
            authedUser = {
              fid: Number(u.fid),
              username: u.username || '',
              displayName: u.displayName || u.name || '',
              avatar: u.pfpUrl || u.avatar || '',
              verified: Boolean(u.verified)
            };
            if (t) setToken(t);
          }
        }
      } catch (_) {
        // ignorar e intentar siguiente estrategia
      }

      if (!authedUser) {
        try {
          // Convención B: sdk.auth.quick() ó sdk.quickAuth() devuelve { user }
          // @ts-ignore
          const session = (sdk.auth?.quick && (await sdk.auth.quick())) || (sdk.quickAuth && (await sdk.quickAuth()));
          const u = session?.user || session?.data?.user;
          const t = session?.token || session?.data?.token;
          if (u?.fid) {
            authedUser = {
              fid: Number(u.fid),
              username: u.username || '',
              displayName: u.displayName || u.name || '',
              avatar: u.pfpUrl || u.avatar || '',
              verified: Boolean(u.verified)
            };
            if (t) setToken(t);
          }
        } catch (_) {}
      }

      // 2) Fallback: usar sdk.context.get() (provee fid/username en Mini App)
      if (!authedUser) {
        try {
          const ctx: any = await sdk.context.get();
          const u = ctx?.user || ctx?.viewer;
          if (u?.fid) {
            authedUser = {
              fid: Number(u.fid),
              username: u.username || '',
              displayName: u.displayName || u.name || '',
              avatar: u.pfpUrl || u.avatar || '',
              verified: Boolean(u.verified)
            };
          }
        } catch (_) {}
      }

      if (authedUser) {
        setUser(authedUser);
        // Persistencia simple en localStorage
        try {
          localStorage.setItem('fc_user', JSON.stringify(authedUser));
          if (token) localStorage.setItem('fc_token', token);
        } catch (_) {}
      } else {
        setError('No se pudo obtener el usuario de Farcaster en Mini App');
      }
    } catch (err) {
      console.error('Error en autenticación de Farcaster:', err);
      setError('Error al conectar con Farcaster');
    } finally {
      setLoading(false);
    }
  }, [detectFarcasterContext]);

  // Login manual
  const login = useCallback(async () => {
    if (!isInFarcaster) {
      setError('No estás en un contexto de Farcaster');
      return;
    }

    await checkFarcasterAuth();
  }, [isInFarcaster, checkFarcasterAuth]);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
    setToken(null);
    try {
      localStorage.removeItem('fc_user');
      localStorage.removeItem('fc_token');
    } catch (_) {}
  }, []);

  // Auto-detección y autenticación
  useEffect(() => {
    // detectar al montar
    detectFarcasterContext();
    // restaurar sesión si existe
    try {
      const cachedUser = localStorage.getItem('fc_user');
      const cachedToken = localStorage.getItem('fc_token');
      if (cachedUser) setUser(JSON.parse(cachedUser));
      if (cachedToken) setToken(cachedToken);
    } catch (_) {}
  }, [detectFarcasterContext]);

  useEffect(() => {
    // En Mini App, autenticar automáticamente sin requerir wallet conectada
    if (isInFarcaster) {
      checkFarcasterAuth();
    }
  }, [isInFarcaster, checkFarcasterAuth]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isInFarcaster,
    login,
    logout,
    checkFarcasterAuth,
    token
  };
}
