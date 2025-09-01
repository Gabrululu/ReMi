'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, Loader2, ExternalLink } from 'lucide-react';

export function FarcasterMiniAppTester() {
  const [status, setStatus] = useState<'loading' | 'detected' | 'not-detected' | 'error'>('loading');
  const [details, setDetails] = useState<any>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [readyCalled, setReadyCalled] = useState(false);

  useEffect(() => {
    const testFarcasterMiniApp = async () => {
      try {
        console.log('🧪 Iniciando pruebas de Farcaster Mini App...');
        
        // Detectar contexto
        const isInFarcaster = 
          window.location.href.includes('farcaster.xyz') || 
          window.location.href.includes('miniapps') ||
          window.location.href.includes('warpcast.com') ||
          window.navigator.userAgent.includes('Farcaster') ||
          window.navigator.userAgent.includes('Warpcast') ||
          window !== window.top ||
          document.referrer.includes('farcaster.xyz') ||
          document.referrer.includes('warpcast.com') ||
          window.location.href.includes('localhost') ||
          window.location.href.includes('127.0.0.1') ||
          window.location.search.includes('farcaster') ||
          window.location.search.includes('miniapp');

        const contextDetails = {
          url: window.location.href,
          userAgent: window.navigator.userAgent,
          referrer: document.referrer,
          isInIframe: window !== window.top,
          isInFarcaster
        };

        setDetails(contextDetails);
        console.log('Contexto detectado:', contextDetails);

        if (isInFarcaster) {
          setStatus('detected');
          console.log('✅ Contexto de Farcaster detectado');
          
          // Intentar cargar el SDK
          try {
            const { sdk } = await import('@farcaster/miniapp-sdk');
            setSdkLoaded(true);
            console.log('✅ SDK cargado correctamente');
            
            // Intentar llamar ready()
            try {
              await sdk.actions.ready();
              setReadyCalled(true);
              console.log('✅ ready() llamado exitosamente');
            } catch (readyError) {
              console.error('❌ Error al llamar ready():', readyError);
            }
          } catch (sdkError) {
            console.error('❌ Error al cargar SDK:', sdkError);
            setStatus('error');
          }
        } else {
          setStatus('not-detected');
          console.log('ℹ️ No se detectó contexto de Farcaster Mini App');
        }
      } catch (error) {
        console.error('❌ Error en pruebas:', error);
        setStatus('error');
      }
    };

    testFarcasterMiniApp();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      case 'detected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'not-detected':
        return <Info className="w-4 h-4 text-gray-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Probando Farcaster Mini App...';
      case 'detected':
        return 'Farcaster Mini App detectada';
      case 'not-detected':
        return 'No se detectó contexto de Farcaster Mini App';
      case 'error':
        return 'Error en las pruebas';
      default:
        return 'Estado desconocido';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🧪 Pruebas de Farcaster Mini App
      </h3>
      
      <div className="space-y-4">
        {/* Estado general */}
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {getStatusText()}
          </span>
        </div>

        {/* Detalles del contexto */}
        {details && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Detalles del contexto:
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">URL:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">
                  {details.url.length > 50 ? details.url.substring(0, 50) + '...' : details.url}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">En iframe:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">
                  {details.isInIframe ? 'Sí' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Contexto detectado:</span>
                <span className="font-mono text-gray-800 dark:text-gray-200">
                  {details.isInFarcaster ? 'Sí' : 'No'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Estado del SDK */}
        <div className="flex items-center space-x-2">
          {sdkLoaded ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
          )}
          <span className="text-sm text-gray-700 dark:text-gray-300">
            SDK: {sdkLoaded ? 'Cargado' : 'Cargando...'}
          </span>
        </div>

        {/* Estado de ready() */}
        <div className="flex items-center space-x-2">
          {readyCalled ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : status === 'detected' ? (
            <AlertCircle className="w-4 h-4 text-yellow-600" />
          ) : (
            <Info className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-sm text-gray-700 dark:text-gray-300">
            ready(): {readyCalled ? 'Llamado' : status === 'detected' ? 'Pendiente' : 'No aplicable'}
          </span>
        </div>

        {/* Enlaces útiles */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex space-x-4">
            <a 
              href="https://farcaster.xyz/~/settings/developer-tools" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Developer Tools</span>
            </a>
            <a 
              href="https://miniapps.farcaster.xyz/docs/getting-started" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Documentación</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
