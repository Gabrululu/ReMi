'use client';

import { useFarcasterAuth } from '../hooks/useFarcasterAuth';
import { useAccount } from 'wagmi';
import { UserProfile } from './UserProfile';
import { FarcasterNotifications } from './FarcasterNotifications';
import { MiniAppDetector } from './MiniAppDetector';
import { Users, Bell, Share2, Trophy, Calendar, Target } from 'lucide-react';

export function FarcasterDashboard() {
  const { address, isConnected } = useAccount();
  const { user: farcasterUser, isAuthenticated: isFarcasterAuthenticated } = useFarcasterAuth();

  const stats = [
    {
      title: 'Tareas Completadas',
      value: '24',
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: 'Racha Actual',
      value: '7 días',
      icon: Calendar,
      color: 'text-blue-600'
    },
    {
      title: 'REMI Ganados',
      value: '1,337',
      icon: Trophy,
      color: 'text-purple-600'
    },
    {
      title: 'Seguidores',
      value: farcasterUser?.fid ? '156' : '0',
      icon: Users,
      color: 'text-orange-600'
    }
  ];

  const shareOnFarcaster = async () => {
    try {
      const shareText = `¡Acabo de completar una tarea en ReMi! 🎉\n\nMi progreso:\n✅ 24 tareas completadas\n🔥 Racha de 7 días\n💰 1,337 REMI ganados\n\n¡Únete a mí en @remi_app!`;
      
      // Copiar al portapapeles para compartir en Farcaster
      await navigator.clipboard.writeText(shareText);
      alert('Texto copiado al portapapeles. Compártelo en Farcaster!');
    } catch (error) {
      console.error('Error compartiendo:', error);
      alert('Error al copiar al portapapeles');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">ReMi Dashboard</h1>
        <p className="opacity-90">
          Tu agenda social con recompensas Web3 integrada con Farcaster
        </p>
      </div>

      {/* Mini App Detector */}
      <MiniAppDetector />

      {/* Estado de conexión */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <p className="font-medium">Wallet</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? 'Conectada' : 'No conectada'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border-l-4 border-purple-500">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isFarcasterAuthenticated ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <p className="font-medium">Farcaster</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isFarcasterAuthenticated ? 'Conectado' : 'No conectado'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 text-center">
            <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={shareOnFarcaster}
          className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
        >
          <Share2 className="w-5 h-5" />
          <span>Compartir en Farcaster</span>
        </button>

        <button
          onClick={() => window.open('https://farcaster.xyz/miniapps/Nf9G0Et26Mk9/remi---your-social-web3-schedule', '_blank')}
          className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all"
        >
          <Bell className="w-5 h-5" />
          <span>Ver en Farcaster</span>
        </button>
      </div>

      {/* Perfil de usuario */}
      <UserProfile />

      {/* Notificaciones */}
      <FarcasterNotifications />
    </div>
  );
} 