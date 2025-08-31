'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useMiniApp } from '@neynar/react';

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
}

export function useFarcasterAuth(): UseFarcasterAuthReturn {
  const { address, isConnected } = useAccount();
  const { isSDKLoaded, context } = useMiniApp();
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInFarcaster, setIsInFarcaster] = useState(false);

  // Detectar si estamos en contexto de Farcaster
  const detectFarcasterContext = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const isInFarcaster = window.location.href.includes('farcaster.xyz') || 
                          window.navigator.userAgent.includes('Farcaster') ||
                          context === 'mini-app' ||
                          isSDKLoaded;
    
    setIsInFarcaster(isInFarcaster);
    return isInFarcaster;
  }, [context, isSDKLoaded]);

  // Verificar autenticación de Farcaster
  const checkFarcasterAuth = useCallback(async () => {
    if (!detectFarcasterContext()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Intentar obtener datos del usuario usando el contexto de Mini App
      const response = await fetch('/api/me', {
        headers: {
          'x-farcaster-context': 'mini-app',
          'x-farcaster-auth': 'true'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log('Usuario autenticado con Farcaster:', userData);
      } else {
        setError('No se pudo autenticar con Farcaster');
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
  }, []);

  // Auto-detección y autenticación
  useEffect(() => {
    detectFarcasterContext();
  }, [detectFarcasterContext]);

  // Auto-login cuando se detecta contexto de Farcaster
  useEffect(() => {
    if (isInFarcaster && !user && !loading && isSDKLoaded) {
      checkFarcasterAuth();
    }
  }, [isInFarcaster, user, loading, checkFarcasterAuth, isSDKLoaded]);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isInFarcaster,
    login,
    logout,
    checkFarcasterAuth
  };
}
