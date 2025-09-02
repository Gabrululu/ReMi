'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useDisconnect, useSwitchChain, useConnect } from 'wagmi';
import { createRemiContract, getNetworkInfo } from '../lib/contracts';
import { UserStats } from './UserStats';
import { useFarcasterAuth } from '../hooks/useFarcasterAuth';
import { baseSepolia } from 'wagmi/chains';
import { defineChain } from 'viem';
import { User, CheckCircle, AlertCircle, Loader2, Wallet, Smartphone, ExternalLink } from 'lucide-react';

// Define Celo Alfajores chain
const celoAlfajores = defineChain({
  id: 44787,
  name: 'Celo Alfajores',
  nativeCurrency: {
    decimals: 18,
    name: 'Celo',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://alfajores-forno.celo-testnet.org'],
    },
    public: {
      http: ['https://alfajores-forno.celo-testnet.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Celo Alfajores Explorer',
      url: 'https://alfajores.celoscan.io',
    },
  },
  testnet: true,
});

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { connect, connectors, isPending } = useConnect();
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState<'baseSepolia' | 'celoAlfajores'>('baseSepolia');
  const [error, setError] = useState<string | null>(null);
  const [showWalletOptions, setShowWalletOptions] = useState(false);

  // Use Farcaster authentication
  const { 
    user: farcasterUser, 
    loading: farcasterLoading, 
    error: farcasterError, 
    isAuthenticated: isFarcasterAuthenticated,
    isInFarcaster,
    login: farcasterLogin,
    logout: farcasterLogout
  } = useFarcasterAuth();

  // Get balance using wagmi
  const { data: balance } = useBalance({
    address,
    token: network === 'baseSepolia' 
      ? '0x2bd8AbEB2F5598f8477560C70c742aFfc22912de' // RemiToken on Base Sepolia
      : '0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B' // RemiToken on Celo Alfajores
  });

  useEffect(() => {
    if (isConnected && address) {
      loadUserStats();
    }
  }, [isConnected, address, network]);

  // Efecto para forzar la detección de wallets
  useEffect(() => {
    // Forzar la detección de wallets después de un breve delay
    const timer = setTimeout(() => {
      console.log('Forzando detección de wallets...');
      console.log('Conectores después del delay:', connectors);
    }, 1000);

    return () => clearTimeout(timer);
  }, [connectors]);

  // Efecto para esperar a que los conectores se inicialicen
  useEffect(() => {
    if (connectors.length > 0) {
      console.log('Conectores inicializados:', connectors.length);
    }
  }, [connectors]);

  const loadUserStats = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const contract = createRemiContract(network);
      const stats = await contract.getUserStats(address);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNetworkChange = async (newNetwork: 'baseSepolia' | 'celoAlfajores') => {
    try {
      const targetChain = newNetwork === 'baseSepolia' ? baseSepolia : celoAlfajores;
      await switchChain({ chainId: targetChain.id });
      setNetwork(newNetwork);
    } catch (error) {
      console.error('Error switching network:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    farcasterLogout();
    setUserStats(null);
  };

  const handleConnectWallet = (connector: any) => {
    try {
      console.log('Intentando conectar con:', connector.name);
      connect({ connector });
      setShowWalletOptions(false);
    } catch (error) {
      console.error('Error conectando wallet:', error);
      setError('Error al conectar con la wallet');
    }
  };

  const handleFarcasterLogin = async () => {
    await farcasterLogin();
  };

    // Filtrar conectores disponibles - mostrar todos los conectores, no solo los ready
  const availableConnectors = connectors;

  // Debug: Log conectores disponibles
  console.log('Todos los conectores:', connectors);
  console.log('Conectores disponibles (ready):', availableConnectors);
  console.log('showWalletOptions:', showWalletOptions);

  // Verificar si WalletConnect está configurado
  const hasWalletConnectProjectId = !!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

  if (!isConnected && !isFarcasterAuthenticated) {
    return (
      <div className="space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Conecta tu Wallet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Accede a múltiples wallets disponibles
          </p>
        </div>

        {/* Wallet Connection Section */}
        <div className="space-y-3">
          {!showWalletOptions ? (
            <button
              onClick={() => {
                console.log('Botón Conectar Wallet clickeado');
                console.log('Conectores antes de mostrar:', connectors);
                setShowWalletOptions(true);
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span>Conectar Wallet</span>
              </div>
            </button>
          ) : (
            <div className="space-y-2">
              {availableConnectors.length > 0 ? (
                availableConnectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => {
                      console.log('Conectando con:', connector.name);
                      handleConnectWallet(connector);
                    }}
                    disabled={isPending}
                    className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-between disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4" />
                      <span className="text-sm">{connector.name}</span>
                    </div>
                    {isPending && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center mb-3">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    Detectando wallets disponibles...
                  </p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mb-3">
                    Esto puede tomar unos segundos.
                  </p>
                  
                  {/* Botón para recargar */}
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-3 text-xs text-blue-500 hover:text-blue-600 underline"
                  >
                    Recargar página
                  </button>
                  
                  {/* Botón para forzar detección */}
                  <button
                    onClick={() => {
                      console.log('Forzando detección de wallets...');
                      // Forzar re-render
                      setShowWalletOptions(false);
                      setTimeout(() => setShowWalletOptions(true), 100);
                    }}
                    className="mt-2 text-xs text-green-500 hover:text-green-600 underline block"
                  >
                    Reintentar detección
                  </button>
                </div>
              )}
              
              <button
                onClick={() => setShowWalletOptions(false)}
                className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium py-2"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Farcaster Connection Section */}
        <div className="border-t pt-4">
          <div className="text-center mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Conecta Farcaster
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-xs">
              Integra tu red social descentralizada
          </p>
        </div>

        {/* Farcaster Connection Status */}
        {isInFarcaster && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div>
                    <p className="font-medium text-purple-800 dark:text-purple-200 text-sm">
                    Farcaster Detectado
                  </p>
                    <p className="text-xs text-purple-600 dark:text-purple-300">
                    {isFarcasterAuthenticated ? 'Autenticado' : 'No autenticado'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {farcasterLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                ) : isFarcasterAuthenticated ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            </div>
            </div>
          )}
            
              <button
                onClick={handleFarcasterLogin}
                disabled={farcasterLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {farcasterLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span className="text-sm">Conectando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                <User className="w-3 h-3" />
                <span className="text-sm">Conectar Farcaster</span>
                  </div>
                )}
              </button>
          </div>

        {/* Error Messages */}
        {farcasterError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-800 dark:text-red-200 text-xs">
                {farcasterError}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-800 dark:text-red-200 text-xs">
                {error}
              </p>
            </div>
            <div className="mt-2">
              <button
                onClick={() => setError(null)}
                className="text-xs text-red-600 dark:text-red-400 hover:underline"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Network Selector */}
      <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Red</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleNetworkChange('baseSepolia')}
            className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-all ${
              network === 'baseSepolia'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-300 dark:border-blue-600'
                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
            }`}
          >
            Base Sepolia
          </button>
          <button
            onClick={() => handleNetworkChange('celoAlfajores')}
            className={`flex-1 py-1 px-2 rounded text-xs font-medium transition-all ${
              network === 'celoAlfajores'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-600'
                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
            }`}
          >
            Celo Alfajores
          </button>
        </div>
      </div>

      {/* User Stats Component */}
      <UserStats 
        userStats={userStats}
        network={network}
        loading={loading}
      />

      {/* Farcaster User Info */}
      {isFarcasterAuthenticated && farcasterUser && (
        <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Usuario de Farcaster
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                @{farcasterUser.username}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                FID: {farcasterUser.fid}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-2">
        <button
          onClick={handleDisconnect}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-gray-700 hover:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🔙 Desconectar Todo
        </button>
      </div>
    </div>
  );
} 