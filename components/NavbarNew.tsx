'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export default function NavbarNew() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = () => {
    const connector = connectors[0];
    if (connector) {
      connect({ connector });
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <span className="text-xl font-bold text-gray-900">ReMi</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/new" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/new' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Nuevo
            </Link>
            <Link 
              href="/profile" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/profile' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Perfil
            </Link>
            {isConnected ? (
              <button
                onClick={() => disconnect()}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600"
              >
                Desconectar
              </button>
            ) : (
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
              >
                Conectar
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 