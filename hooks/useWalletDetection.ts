'use client';

import { useState, useEffect } from 'react';
import { useConnect, useAccount } from 'wagmi';

export interface WalletInfo {
  id: string;
  name: string;
  icon: string;
  type: 'extension' | 'mobile' | 'web';
  isAvailable: boolean;
  isInstalled: boolean;
}

export function useWalletDetection() {
  const { connectors } = useConnect();
  const { isConnected } = useAccount();
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if user is on mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const detectWallets = async () => {
      const wallets: WalletInfo[] = [];

      // Check for browser extensions
      const checkExtension = (name: string, id: string, icon: string) => {
        const isInstalled = typeof window !== 'undefined' && 
          (window as any).ethereum?.isMetaMask ||
          (window as any).ethereum?.isCoinbaseWallet ||
          (window as any).ethereum?.isTokenPocket ||
          (window as any).ethereum?.isTrust ||
          (window as any).ethereum?.providers?.some((provider: any) => provider.isMetaMask);

        wallets.push({
          id,
          name,
          icon,
          type: 'extension',
          isAvailable: !isMobile && isInstalled,
          isInstalled: !!isInstalled
        });
      };

      // Check for specific extensions
      checkExtension('MetaMask', 'metamask', '🦊');
      checkExtension('Coinbase Wallet', 'coinbase', '🪙');
      checkExtension('TokenPocket', 'tokenpocket', '💼');
      checkExtension('Trust Wallet', 'trust', '🛡️');

      // Add WalletConnect for mobile
      wallets.push({
        id: 'walletconnect',
        name: 'WalletConnect',
        icon: '🔗',
        type: 'mobile',
        isAvailable: true, // Always available
        isInstalled: true
      });

      // Add generic injected wallet if ethereum is available
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        wallets.push({
          id: 'injected',
          name: 'Browser Wallet',
          icon: '🌐',
          type: 'extension',
          isAvailable: !isMobile,
          isInstalled: true
        });
      }

      setAvailableWallets(wallets);
    };

    detectWallets();
  }, [isMobile]);

  const getRecommendedWallet = (): WalletInfo | null => {
    // On mobile, recommend WalletConnect
    if (isMobile) {
      return availableWallets.find(w => w.id === 'walletconnect') || null;
    }

    // On desktop, recommend installed extensions in order of preference
    const installedWallets = availableWallets.filter(w => w.isInstalled && w.type === 'extension');
    
    const preferenceOrder = ['metamask', 'coinbase', 'tokenpocket', 'trust', 'injected'];
    
    for (const preferredId of preferenceOrder) {
      const wallet = installedWallets.find(w => w.id === preferredId);
      if (wallet) return wallet;
    }

    // Fallback to WalletConnect if no extensions are installed
    return availableWallets.find(w => w.id === 'walletconnect') || null;
  };

  const getConnectionOptions = () => {
    const recommended = getRecommendedWallet();
    const otherOptions = availableWallets.filter(w => 
      w.id !== recommended?.id && w.isAvailable
    );

    return {
      recommended,
      otherOptions,
      isMobile,
      hasExtensions: availableWallets.some(w => w.type === 'extension' && w.isInstalled)
    };
  };

  return {
    availableWallets,
    getConnectionOptions,
    isMobile,
    isConnected
  };
} 