'use client';

import { useEffect } from 'react';

export function FarcasterReady() {
  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        console.log('🚀 Inicializando Farcaster Mini App...');
        
        // Importar el SDK
        const { sdk } = await import('@farcaster/miniapp-sdk');
        
        console.log('✅ SDK cargado correctamente');
        
        // Esperar a que la app esté completamente cargada
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('📞 Llamando sdk.actions.ready()...');
        
        // Llamar ready() según la documentación
        await sdk.actions.ready();
        
        console.log('✅ ready() llamado exitosamente');
      } catch (error) {
        console.error('❌ Error al inicializar Farcaster:', error);
      }
    };

    // Ejecutar la inicialización
    initializeFarcaster();
  }, []);

  return null;
}
