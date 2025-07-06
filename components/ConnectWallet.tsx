'use client';

import React, { useState, useEffect } from 'react';
import { useAccount, useBalance, useDisconnect, useConnect, useSwitchChain } from 'wagmi';
import { createRemiContract, getNetworkInfo } from '../lib/contracts';
import { UserStats } from './UserStats';
import { useWalletDetection } from '../hooks/useWalletDetection';
import { baseSepolia } from 'wagmi/chains';
import { defineChain } from 'viem';

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
  const { connect, connectors, isPending } = useConnect();
  const { switchChain } = useSwitchChain();
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [network, setNetwork] = useState<'baseSepolia' | 'celoAlfajores'>('baseSepolia');
  const [showAllOptions, setShowAllOptions] = useState(false);

  // Use smart wallet detection
  const { getConnectionOptions, isMobile } = useWalletDetection();
  const { recommended, otherOptions, hasExtensions } = getConnectionOptions();

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
    setUserStats(null);
  };

  const handleConnect = (walletId: string) => {
    const connector = connectors.find(c => {
      if (walletId === 'metamask') return c.name === 'MetaMask';
      if (walletId === 'coinbase') return c.name === 'Coinbase Wallet';
      if (walletId === 'walletconnect') return c.name === 'WalletConnect';
      if (walletId === 'injected') return c.name === 'Injected';
      return false;
    });

    if (connector) {
      connect({ connector });
    }
  };

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Conecta tu Wallet
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {isMobile 
              ? 'Escanea el código QR con tu wallet móvil'
              : 'Selecciona tu wallet preferida'
            }
          </p>
        </div>

        {/* Recommended Wallet Button */}
        {recommended && (
          <button
            onClick={() => handleConnect(recommended.id)}
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Conectando...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span className="text-xl">{recommended.icon}</span>
                <div className="text-left">
                  <div className="font-semibold">Conectar {recommended.name}</div>
                  <div className="text-xs opacity-90">
                    {isMobile ? 'Wallet móvil recomendada' : 'Wallet recomendada'}
                  </div>
                </div>
              </div>
            )}
          </button>
        )}

        {/* Other Options */}
        {otherOptions.length > 0 && (
          <div className="space-y-2">
            {!showAllOptions && (
              <button
                onClick={() => setShowAllOptions(true)}
                className="w-full text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 text-sm font-medium py-2"
              >
                Ver otras opciones ({otherOptions.length})
              </button>
            )}

            {showAllOptions && (
              <div className="space-y-2">
                {otherOptions.map((wallet) => (
                  <button
                    key={wallet.id}
                    onClick={() => handleConnect(wallet.id)}
                    disabled={isPending}
                    className="w-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-between disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{wallet.icon}</span>
                      <span>{wallet.name}</span>
                    </div>
                    {wallet.type === 'extension' && (
                      <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                        Instalada
                      </span>
                    )}
                  </button>
                ))}
                
                <button
                  onClick={() => setShowAllOptions(false)}
                  className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-sm font-medium py-2"
                >
                  Ocultar opciones
                </button>
              </div>
            )}
          </div>
        )}

        {/* No Wallets Installed Message */}
        {!hasExtensions && !isMobile && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                No tienes wallets instaladas
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-3">
                Instala MetaMask o usa WalletConnect con tu wallet móvil
              </p>
              <div className="space-y-2">
                <a
                  href="https://metamask.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  🦊 Instalar MetaMask
                </a>
                <button
                  onClick={() => handleConnect('walletconnect')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  🔗 Usar WalletConnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Network Selector */}
      <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Red</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleNetworkChange('baseSepolia')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              network === 'baseSepolia'
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-2 border-blue-300 dark:border-blue-600'
                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
            }`}
          >
            Base Sepolia
          </button>
          <button
            onClick={() => handleNetworkChange('celoAlfajores')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              network === 'celoAlfajores'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-600'
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

      {/* Quick Actions */}
      <div className="space-y-3">
        <button
          onClick={handleDisconnect}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 dark:from-gray-500 dark:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-gray-700 hover:to-gray-800 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🔙 Desconectar
        </button>
      </div>
    </div>
  );
} 