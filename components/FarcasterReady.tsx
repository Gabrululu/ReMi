'use client';

import { useEffect } from 'react';

export function FarcasterReady() {
  useEffect(() => {
    let mounted = true;
    
    async function go() {
      try {
        console.log('🚀 Inicializando Farcaster Mini App...');
        
        // Importar el SDK
        const { sdk } = await import('@farcaster/miniapp-sdk');
        
        console.log('✅ SDK cargado correctamente');
        
        // Opcional: chequea contexto si tu SDK lo expone
        // const ctx = await sdk.context.get();
        // if (!ctx?.isMiniApp) return;
        
        console.log('📞 Llamando sdk.actions.ready()...');
        
        // Llamar ready() según la documentación
        await sdk.actions.ready();
        
        console.log('✅ ready() llamado exitosamente');
      } catch (e) {
        console.error('❌ ready() failed', e);
      }
    }
    
    if (mounted) go();
    
    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
