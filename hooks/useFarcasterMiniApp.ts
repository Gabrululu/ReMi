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
        // Verificar si estamos en un contexto de Farcaster Mini App
        // Según la documentación, debemos detectar de manera más robusta
        const isInFarcaster = 
          window.location.href.includes('farcaster.xyz') || 
          window.location.href.includes('miniapps') ||
          window.location.href.includes('warpcast.com') ||
          window.navigator.userAgent.includes('Farcaster') ||
          window.navigator.userAgent.includes('Warpcast') ||
          // Detectar si estamos en un iframe (común en Mini Apps)
          window !== window.top ||
          // Detectar headers específicos de Farcaster
          document.referrer.includes('farcaster.xyz') ||
          document.referrer.includes('warpcast.com');

        console.log('Detectando contexto de Farcaster:', {
          url: window.location.href,
          userAgent: window.navigator.userAgent,
          referrer: document.referrer,
          isInIframe: window !== window.top,
          isInFarcaster
        });

        if (isInFarcaster) {
          setIsMiniApp(true);
          
          // Importar el SDK dinámicamente solo en el cliente
          const { sdk: farcasterSDK } = await import('@farcaster/miniapp-sdk');
          setSdk(farcasterSDK);
          
          console.log('Farcaster Mini App SDK cargado correctamente');
        } else {
          console.log('No se detectó contexto de Farcaster Mini App');
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
    console.log('Intentando llamar ready()...', { sdk: !!sdk, isMiniApp });
    
    if (!sdk) {
      console.log('SDK no disponible, saltando ready()');
      return;
    }

    try {
      console.log('Llamando sdk.actions.ready()...');
      await sdk.actions.ready();
      setIsReady(true);
      console.log('✅ Farcaster Mini App marcada como lista');
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
