'use client';

import { useFarcasterAuth } from '../hooks/useFarcasterAuth';
import { useAccount } from 'wagmi';
import { User, Wallet, LogOut, CheckCircle, AlertCircle } from 'lucide-react';

export function UserProfile() {
  const { address, isConnected } = useAccount();
  const { user: farcasterUser, isAuthenticated: isFarcasterAuthenticated, logout: farcasterLogout } = useFarcasterAuth();

  const handleLogout = () => {
    farcasterLogout();
    // Note: disconnect is not available from useAccount, would need useDisconnect if needed
  };

  if (!isConnected && !isFarcasterAuthenticated) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
        <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold mb-2">No conectado</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Conecta tu wallet y Farcaster para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <img
            src={farcasterUser?.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="w-16 h-16 rounded-full border-2 border-blue-500"
          />
          {isFarcasterAuthenticated && (
            <CheckCircle className="w-5 h-5 text-green-500 absolute -bottom-1 -right-1 bg-white rounded-full" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold">
            {farcasterUser?.displayName || 'Usuario'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            @{farcasterUser?.username || 'usuario'}
          </p>
          {farcasterUser?.verified && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verificado
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Información de Wallet */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Wallet className="w-5 h-5 text-gray-500" />
          <div className="flex-1">
            <p className="text-sm font-medium">Wallet</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isConnected ? (
                `${address?.slice(0, 6)}...${address?.slice(-4)}`
              ) : (
                'No conectada'
              )}
            </p>
          </div>
          {isConnected ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          )}
        </div>

        {/* Información de Farcaster */}
        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <User className="w-5 h-5 text-gray-500" />
          <div className="flex-1">
            <p className="text-sm font-medium">Farcaster</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isFarcasterAuthenticated ? (
                `FID: ${farcasterUser?.fid}`
              ) : (
                'No conectado'
              )}
            </p>
          </div>
          {isFarcasterAuthenticated ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          )}
        </div>

        {/* Botón de logout */}
        {(isConnected || isFarcasterAuthenticated) && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        )}
      </div>
    </div>
  );
} 