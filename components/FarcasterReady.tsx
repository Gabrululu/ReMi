'use client';

import { useEffect } from 'react';

export function FarcasterReady() {
  useEffect(() => {
    const callReady = async () => {
      try {
        console.log('🚀 Intentando cargar SDK de Farcaster...');
        
        // Importar el SDK
        const { sdk } = await import('@farcaster/miniapp-sdk');
        
        console.log('✅ SDK cargado, llamando ready()...');
        
        // Llamar ready() inmediatamente
        await sdk.actions.ready();
        
        console.log('✅ ready() llamado exitosamente');
      } catch (error) {
        console.error('❌ Error al llamar ready():', error);
      }
    };

    // Ejecutar después de un breve delay para asegurar que todo esté listo
    const timer = setTimeout(callReady, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return null;
}
