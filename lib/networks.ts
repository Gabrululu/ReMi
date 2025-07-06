import { defineChain } from 'viem';

// Base Sepolia (already available in @reown/appkit/networks)
export const baseSepolia = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://sepolia.base.org'],
    },
    public: {
      http: ['https://sepolia.base.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Base Sepolia Explorer',
      url: 'https://sepolia.basescan.org',
    },
  },
  testnet: true,
});

// Celo Alfajores (custom network)
export const celoAlfajores = defineChain({
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

// Export both networks for use in AppKit
export const networks = [baseSepolia, celoAlfajores];

// Network info helper
export function getNetworkInfo(chainId: number) {
  switch (chainId) {
    case 84532:
      return {
        name: 'Base Sepolia',
        chainId: 84532,
        rpcUrl: 'https://sepolia.base.org',
        explorer: 'https://sepolia.basescan.org',
        contractAddress: process.env.NEXT_PUBLIC_REMI_TOKEN_BASE || '0x2bd8AbEB2F5598f8477560C70c742aFfc22912de'
      };
    case 44787:
      return {
        name: 'Celo Alfajores',
        chainId: 44787,
        rpcUrl: 'https://alfajores-forno.celo-testnet.org',
        explorer: 'https://alfajores.celoscan.io',
        contractAddress: process.env.NEXT_PUBLIC_REMI_TOKEN_CELO || '0x321a83089D68c37c2Ee4Df00cC30B4D330f0399B'
      };
    default:
      return null;
  }
} 