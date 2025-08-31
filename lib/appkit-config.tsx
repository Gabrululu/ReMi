'use client'

import React, { useEffect, useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'wagmi/chains';
import { defineChain } from 'viem';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Define Celo Alfajores chain
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

// 2. Create wagmi config with smart detection and Farcaster support
const config = createConfig({
  chains: [baseSepolia, celoAlfajores],
  transports: {
    [baseSepolia.id]: http(),
    [celoAlfajores.id]: http(),
  },
  connectors: [
    // Injected connector for browser extensions (MetaMask, etc.)
    injected({
      target: 'metaMask',
    }),
    injected({
      target: 'coinbaseWallet',
    }),
    injected({
      target: 'tokenPocket',
    }),
    injected({
      target: 'trust',
    }),
    // Generic injected for other wallets
    injected(),
    // WalletConnect for mobile wallets (including Farcaster)
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
      metadata: {
        name: 'ReMi - Social Agenda Web3',
        description: 'Tu agenda social con recompensas Web3 y integración Farcaster',
        url: 'https://remi-app.vercel.app',
        icons: ['https://remi-app.vercel.app/icon.png'],
      },
      // Evita mostrar QR modal dentro de Farcaster
      showQrModal: false,
    }),
    // Coinbase Wallet
    coinbaseWallet({
      appName: 'ReMi - Social Agenda Web3',
      appLogoUrl: 'https://remi-app.vercel.app/icon.png',
    }),
  ],
});

// 3. AppKit Provider con manejo de hidratación
export function AppKitProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Evitar renderizado en el servidor para prevenir hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Inicializando ReMi...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config} reconnectOnMount>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export { config, queryClient }; 