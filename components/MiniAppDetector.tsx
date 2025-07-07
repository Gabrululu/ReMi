'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useMiniApp } from '@neynar/react';

interface MiniAppContext {
  isMiniApp: boolean;
  context?: string;
  fid?: string;
  username?: string;
  walletAddress?: string;
}

export function MiniAppDetector() {
  const { isSDKLoaded, context: neynarContext } = useMiniApp();
  const [context, setContext] = useState<MiniAppContext>({
    isMiniApp: false
  });
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const detectMiniAppContext = async () => {
      if (typeof window === 'undefined') return;

      const miniAppContext: MiniAppContext = {
        isMiniApp: false
      };

      // Detectar si estamos en un contexto de Mini App usando Neynar
      const isInFarcaster = window.location.href.includes('farcaster.xyz') || 
                           window.location.href.includes('miniapps') ||
                           window.navigator.userAgent.includes('Farcaster') ||
                           neynarContext === 'mini-app';

      if (isInFarcaster && ((window as any).farcasterSDK || isSDKLoaded)) {
        miniAppContext.isMiniApp = true;
        miniAppContext.context = neynarContext || (window as any).farcasterSDK?.context || 'mini-app';

        // Intentar obtener información del usuario
        try {
          const response = await (window as any).farcasterSDK.actions.fetch('/api/me');
          if (response.ok) {
            const userData = await response.json();
            miniAppContext.fid = userData.fid?.toString();
            miniAppContext.username = userData.username;
          }
        } catch (error) {
          console.log('No se pudo obtener información del usuario:', error);
        }

        // Intentar obtener la dirección de la wallet
        if ((window as any).farcasterSDK.wallet?.getAddress) {
          try {
            const walletAddress = await (window as any).farcasterSDK.wallet.getAddress();
            miniAppContext.walletAddress = walletAddress;
          } catch (error) {
            console.log('No se pudo obtener la dirección de la wallet:', error);
          }
        }
      }

      setContext(miniAppContext);
      setLoading(false);
    };

    // Esperar a que el SDK se cargue
    const checkSDK = () => {
      if ((window as any).farcasterSDK) {
        detectMiniAppContext();
      } else {
        setTimeout(checkSDK, 100);
      }
    };

    checkSDK();
  }, [isClient, isSDKLoaded, neynarContext]);

  // No renderizar hasta que estemos en el cliente
  if (!isClient) {
    return <div></div>;
  }

  if (loading) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-blue-700 dark:text-blue-300">Detectando contexto de Mini App...</span>
        </div>
      </div>
    );
  }

  if (!context.isMiniApp) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Info className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600 dark:text-gray-400">
            No estás en un contexto de Farcaster Mini App
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <span className="font-semibold text-green-800 dark:text-green-200">
          Farcaster Mini App Detectado
        </span>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-green-700 dark:text-green-300">Contexto:</span>
          <span className="font-mono text-green-800 dark:text-green-200">
            {context.context || 'mini-app'}
          </span>
        </div>
        
        {context.fid && (
          <div className="flex justify-between">
            <span className="text-green-700 dark:text-green-300">FID:</span>
            <span className="font-mono text-green-800 dark:text-green-200">
              {context.fid}
            </span>
          </div>
        )}
        
        {context.username && (
          <div className="flex justify-between">
            <span className="text-green-700 dark:text-green-300">Usuario:</span>
            <span className="font-mono text-green-800 dark:text-green-200">
              @{context.username}
            </span>
          </div>
        )}
        
        {context.walletAddress && (
          <div className="flex justify-between">
            <span className="text-green-700 dark:text-green-300">Wallet:</span>
            <span className="font-mono text-green-800 dark:text-green-200">
              {context.walletAddress.slice(0, 6)}...{context.walletAddress.slice(-4)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
} 