import { useEffect, useState } from 'react';

// Farcaster SDK types
declare global {
  interface Window {
    farcasterSDK?: {
      actions: {
        ready: () => Promise<void>;
      };
    };
  }
}

export function useFarcasterSDK() {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    let retryCount = 0;
    const maxRetries = 10;
    const retryDelay = 500;

    const initializeSDK = async () => {
      try {
        // Load SDK dynamically
        if (!window.farcasterSDK) {
          try {
            // @ts-ignore - Dynamic import from CDN
            const sdkModule = await import('https://esm.sh/@farcaster/miniapp-sdk');
            window.farcasterSDK = sdkModule.sdk;
            console.log('Farcaster SDK loaded successfully');
          } catch (importError) {
            console.error('Error importing Farcaster SDK:', importError);
            throw importError;
          }
        }

        // Check if SDK is available
        if (window.farcasterSDK?.actions?.ready) {
          console.log('Farcaster SDK found, calling ready()');
          await window.farcasterSDK.actions.ready();
          console.log('Farcaster SDK ready called successfully');
          setIsReady(true);
          setError(null);
        } else {
          console.log(`Farcaster SDK not found, retry ${retryCount + 1}/${maxRetries}`);
          
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(initializeSDK, retryDelay);
          } else {
            console.warn('Farcaster SDK not available after maximum retries');
            setError('Farcaster SDK not available');
            setIsReady(false);
          }
        }
      } catch (err) {
        console.error('Error initializing Farcaster SDK:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Start initialization after a short delay
    const timer = setTimeout(initializeSDK, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return {
    isReady,
    isLoading,
    error,
    sdk: window.farcasterSDK
  };
} 