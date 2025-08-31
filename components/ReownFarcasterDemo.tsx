'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useFarcasterAuth } from '../hooks/useFarcasterAuth';
import { User, Wallet, LogOut, CheckCircle, AlertCircle, Loader2, Share2, Trophy, Calendar, Target } from 'lucide-react';

export function ReownFarcasterDemo() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { 
    user: farcasterUser, 
    loading: farcasterLoading, 
    error: farcasterError, 
    isAuthenticated: isFarcasterAuthenticated,
    isInFarcaster,
    login: farcasterLogin,
    logout: farcasterLogout
  } = useFarcasterAuth();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleConnectWallet = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    farcasterLogout();
  };

  const handleFarcasterLogin = async () => {
    await farcasterLogin();
  };

  const shareOnFarcaster = async () => {
    try {
      const shareText = `¡Acabo de completar una tarea en ReMi! 🎉\n\nMi progreso:\n✅ 24 tareas completadas\n🔥 Racha de 7 días\n💰 1,337 REMI ganados\n\n¡Únete a mí en @remi_app!`;
      
      // Copiar al portapapeles para compartir en Farcaster
      await navigator.clipboard.writeText(shareText);
      alert('Texto copiado al portapapeles. Compártelo en Farcaster!');
    } catch (error) {
      console.error('Error compartiendo:', error);
      alert('Error al copiar al portapapeles');
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Reown + Farcaster Integration
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Demostración de la integración completa de Reown con Farcaster
        </p>
      </div>

      {/* Estado de conexión */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Wallet Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>Estado de Wallet (Reown)</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Conexión
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isConnected ? 'Conectada' : 'No conectada'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {isConnected ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </div>

            {isConnected && address && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Dirección de Wallet
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
            )}

            {!isConnected && (
              <button
                onClick={handleConnectWallet}
                disabled={isPending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Conectando wallet...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Wallet className="w-5 h-5" />
                    <span>Conectar Wallet</span>
                  </div>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Farcaster Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Estado de Farcaster</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Autenticación
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isFarcasterAuthenticated ? 'Autenticado' : 'No autenticado'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {farcasterLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                ) : isFarcasterAuthenticated ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </div>

            {isFarcasterAuthenticated && farcasterUser && (
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Usuario de Farcaster
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-300">
                  @{farcasterUser.username} (FID: {farcasterUser.fid})
                </p>
                {farcasterUser.displayName && (
                  <p className="text-xs text-purple-600 dark:text-purple-300">
                    {farcasterUser.displayName}
                  </p>
                )}
              </div>
            )}

            {!isFarcasterAuthenticated && isInFarcaster && (
              <button
                onClick={handleFarcasterLogin}
                disabled={farcasterLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {farcasterLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Conectando Farcaster...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Conectar Farcaster</span>
                  </div>
                )}
              </button>
            )}

            {!isInFarcaster && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  No estás en un contexto de Farcaster
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      {(isConnected || isFarcasterAuthenticated) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Estadísticas
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">24</p>
              <p className="text-sm text-green-600 dark:text-green-300">Tareas Completadas</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">7</p>
              <p className="text-sm text-blue-600 dark:text-blue-300">Días de Racha</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-purple-600" />
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">1,337</p>
              <p className="text-sm text-purple-600 dark:text-purple-300">REMI Ganados</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
              <User className="w-6 h-6 mx-auto mb-2 text-orange-600" />
              <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                {farcasterUser?.fid ? '156' : '0'}
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-300">Seguidores</p>
            </div>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="space-y-3">
        {(isConnected || isFarcasterAuthenticated) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={shareOnFarcaster}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <Share2 className="w-5 h-5" />
              <span>Compartir en Farcaster</span>
            </button>

            <button
              onClick={() => window.open('https://farcaster.xyz/miniapps/Nf9G0Et26Mk9/remi---your-social-web3-schedule', '_blank')}
              className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
            >
              <User className="w-5 h-5" />
              <span>Ver en Farcaster</span>
            </button>
          </div>
        )}

        {(isConnected || isFarcasterAuthenticated) && (
          <button
            onClick={handleDisconnect}
            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-700 hover:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Desconectar Todo</span>
            </div>
          </button>
        )}
      </div>

      {/* Errores */}
      {farcasterError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-800 dark:text-red-200 text-sm">
              {farcasterError}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
