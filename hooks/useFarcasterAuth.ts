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
}

export function useFarcasterAuth(): UseFarcasterAuthReturn {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInFarcaster, setIsInFarcaster] = useState(false);

  // Detectar si estamos en contexto de Farcaster
  const detectFarcasterContext = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const isInFarcaster = window.location.href.includes('farcaster.xyz') || 
                          window.navigator.userAgent.includes('Farcaster');
    
    setIsInFarcaster(isInFarcaster);
    return isInFarcaster;
  }, []);

  // Verificar autenticación de Farcaster
  const checkFarcasterAuth = useCallback(async () => {
    if (!detectFarcasterContext()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simular datos de usuario para demo
      const mockUser: FarcasterUser = {
        fid: 12345,
        username: 'remi_user',
        displayName: 'ReMi User',
        avatar: 'https://re-mi.vercel.app/icon.png',
        verified: true,
        followerCount: 156,
        followingCount: 89
      };
      
      setUser(mockUser);
      console.log('Usuario autenticado con Farcaster:', mockUser);
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

  useEffect(() => {
    if (isInFarcaster && isConnected) {
      checkFarcasterAuth();
    }
  }, [isInFarcaster, isConnected, checkFarcasterAuth]);

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
