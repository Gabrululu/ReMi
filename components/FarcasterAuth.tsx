'use client';

import React, { useState, useEffect } from 'react';

interface FarcasterUser {
  fid: number;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
}

interface FarcasterAuthProps {
  children: (user: FarcasterUser | null, isAuthenticated: boolean, login: () => void) => React.ReactNode;
}

export function FarcasterAuth({ children }: FarcasterAuthProps) {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAuthenticated = !!user;

  const login = async () => {
    if (!isClient || typeof window === 'undefined') {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verificar si estamos en contexto de Farcaster
      const isInFarcaster = typeof window !== 'undefined' && (
        window.location.href.includes('farcaster.xyz') || 
        window.navigator.userAgent.includes('Farcaster')
      );

      if (isInFarcaster) {
        // Simular datos de usuario para Farcaster
        const mockUser: FarcasterUser = {
          fid: 12345,
          username: 'usuario_remi',
          displayName: 'Usuario ReMi',
          avatar: 'https://via.placeholder.com/150',
          verified: true
        };
        setUser(mockUser);
      } else {
        setError('No estás en un contexto de Farcaster');
      }
    } catch (err) {
      console.error('Error en autenticación de Farcaster:', err);
      setError('Error al conectar con Farcaster');
    } finally {
      setLoading(false);
    }
  };

  // No renderizar nada hasta que estemos en el cliente
  if (!isClient) {
    return null;
  }

  return <>{children(user, isAuthenticated, login)}</>;
} 