'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useFarcasterAuth } from '../hooks/useFarcasterAuth';
import { User, Wallet, LogOut, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ReownFarcasterIntegrationProps {
  children?: React.ReactNode;
}

export function ReownFarcasterIntegration({ children }: ReownFarcasterIntegrationProps) {
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

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estado de conexión */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Estado de Conexión
        </h3>
        
        <div className="space-y-4">
          {/* Wallet Connection Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Wallet
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isConnected ? 'Conectada' : 'No conectada'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
          </div>

          {/* Farcaster Connection Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Farcaster
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isFarcasterAuthenticated ? 'Autenticado' : 'No autenticado'}
                </p>
              </div>
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
        </div>
      </div>

      {/* Acciones */}
      <div className="space-y-3">
        {/* Conectar Wallet */}
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

        {/* Conectar Farcaster */}
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

        {/* Desconectar */}
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

      {/* Información del usuario */}
      {(isConnected || isFarcasterAuthenticated) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Información del Usuario
          </h3>
          
          <div className="space-y-4">
            {/* Wallet Info */}
            {isConnected && address && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Wallet Address
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300 font-mono">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
            )}

            {/* Farcaster Info */}
            {isFarcasterAuthenticated && farcasterUser && (
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Farcaster User
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
          </div>
        </div>
      )}

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

      {/* Children */}
      {children}
    </div>
  );
}
