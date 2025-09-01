import { useEffect, useState } from 'react';

interface UseFarcasterMiniAppReturn {
  isReady: boolean;
  isMiniApp: boolean;
  error: string | null;
  ready: () => Promise<void>;
}

export function useFarcasterMiniApp(): UseFarcasterMiniAppReturn {
  const [isReady, setIsReady] = useState(false);
  const [isMiniApp, setIsMiniApp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdk, setSdk] = useState<any>(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {        
        const isInFarcaster = window.location.href.includes('farcaster.xyz') || 
                             window.location.href.includes('miniapps') ||
                             window.navigator.userAgent.includes('Farcaster') ||
                             window.location.href.includes('warpcast.com');

        if (isInFarcaster) {
          setIsMiniApp(true);
         
         
          const { sdk: farcasterSDK } = await import('@farcaster/miniapp-sdk');
          setSdk(farcasterSDK);
          
          console.log('Farcaster Mini App SDK cargado correctamente');
        }
      } catch (err) {
        console.error('Error al cargar Farcaster Mini App SDK:', err);
        setError('Error al cargar el SDK de Farcaster Mini App');
      }
    };

    if (typeof window !== 'undefined') {
      initializeSDK();
    }
  }, []);

  const ready = async () => {
    if (!sdk) {
      console.log('SDK no disponible, saltando ready()');
      return;
    }

    try {
      await sdk.actions.ready();
      setIsReady(true);
      console.log('Farcaster Mini App marcada como lista');
    } catch (err) {
      console.error('Error al marcar Mini App como lista:', err);
      setError('Error al marcar la app como lista');
    }
  };

  return {
    isReady,
    isMiniApp,
    error,
    ready
  };
}
