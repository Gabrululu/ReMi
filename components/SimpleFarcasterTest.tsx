'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function SimpleFarcasterTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const testFarcaster = async () => {
      try {
        setMessage('Cargando SDK...');
        
        // Importar el SDK
        const { sdk } = await import('@farcaster/miniapp-sdk');
        
        setMessage('SDK cargado, esperando...');
        
        // Esperar 2 segundos como en la documentación
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setMessage('Llamando ready()...');
        
        // Llamar ready()
        await sdk.actions.ready();
        
        setStatus('success');
        setMessage('✅ ready() llamado exitosamente');
        
        console.log('✅ Farcaster Mini App inicializada correctamente');
      } catch (error) {
        setStatus('error');
        setMessage(`❌ Error: ${error.message}`);
        console.error('❌ Error al inicializar Farcaster:', error);
      }
    };

    testFarcaster();
  }, []);

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {message}
        </span>
      </div>
    </div>
  );
}
