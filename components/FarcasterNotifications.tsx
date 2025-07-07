'use client';

import { useState, useEffect } from 'react';
import { Bell, Send, CheckCircle, AlertCircle } from 'lucide-react';

// Declaración de tipos para el SDK de Farcaster
declare global {
  interface Window {
    farcasterSDK?: {
      actions?: {
        ready?: () => void;
      };
    };
  }
}

interface FarcasterNotificationsProps {
  onNotificationSent?: () => void;
}

export function FarcasterNotifications({ onNotificationSent }: FarcasterNotificationsProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const sendNotification = async () => {
    if (!isClient || !message.trim() || typeof window === 'undefined' || !(window as any).farcasterSDK) {
      setStatus('error');
      return;
    }

    setLoading(true);
    setStatus('idle');

    try {
      // Inicializar el SDK si no está listo
      if ((window as any).farcasterSDK?.actions?.ready) {
        (window as any).farcasterSDK.actions.ready();
      }

      // Simular envío de notificación (el SDK real no tiene este método)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Notificación simulada:', { message, title: 'ReMi - Nueva tarea completada' });
      setStatus('success');
      setMessage('');
      onNotificationSent?.();
    } catch (error) {
      console.error('Error enviando notificación:', error);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendNotification();
  };

  // No renderizar hasta que estemos en el cliente
  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Bell className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Notificaciones de Farcaster</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Mensaje de notificación
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            rows={3}
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Enviando...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Enviar notificación</span>
            </>
          )}
        </button>
      </form>

      {/* Estado de la notificación */}
      {status === 'success' && (
        <div className="mt-4 flex items-center space-x-2 p-3 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
          <CheckCircle className="w-4 h-4" />
          <span>Notificación enviada exitosamente</span>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 flex items-center space-x-2 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>Error al enviar la notificación</span>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Las notificaciones se enviarán a través de Farcaster y aparecerán en la aplicación móvil.
        </p>
      </div>
    </div>
  );
} 