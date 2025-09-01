'use client';

import { useEffect } from 'react';

export function FarcasterMiniAppInitializer() {
  useEffect(() => {
    const initializeFarcasterMiniApp = async () => {
      try {
        console.log('🔍 Inicializando Farcaster Mini App...');
        
        // Detectar contexto de Farcaster de manera más agresiva
        const isInFarcaster = 
          window.location.href.includes('farcaster.xyz') || 
          window.location.href.includes('miniapps') ||
          window.location.href.includes('warpcast.com') ||
          window.navigator.userAgent.includes('Farcaster') ||
          window.navigator.userAgent.includes('Warpcast') ||
          window !== window.top ||
          document.referrer.includes('farcaster.xyz') ||
          document.referrer.includes('warpcast.com');

        console.log('Contexto detectado:', {
          url: window.location.href,
          userAgent: window.navigator.userAgent,
          referrer: document.referrer,
          isInIframe: window !== window.top,
          isInFarcaster
        });

        if (isInFarcaster) {
          console.log('✅ Contexto de Farcaster detectado, cargando SDK...');
          
          // Importar y usar el SDK inmediatamente
          const { sdk } = await import('@farcaster/miniapp-sdk');
          
          console.log('✅ SDK cargado, llamando ready()...');
          
          // Llamar ready() inmediatamente
          await sdk.actions.ready();
          
          console.log('✅ Farcaster Mini App inicializada correctamente');
        } else {
          console.log('ℹ️ No se detectó contexto de Farcaster Mini App');
        }
      } catch (error) {
        console.error('❌ Error al inicializar Farcaster Mini App:', error);
      }
    };

    // Ejecutar inmediatamente
    initializeFarcasterMiniApp();
  }, []);

  return null; // Este componente no renderiza nada
}
