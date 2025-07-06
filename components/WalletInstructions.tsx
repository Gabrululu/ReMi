'use client';

import React, { useState } from 'react';
import { useWalletDetection } from '../hooks/useWalletDetection';

export function WalletInstructions() {
  const [activeTab, setActiveTab] = useState<'desktop' | 'mobile'>('desktop');
  const { isMobile } = useWalletDetection();

  // Auto-detect device and set appropriate tab
  React.useEffect(() => {
    setActiveTab(isMobile ? 'mobile' : 'desktop');
  }, [isMobile]);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">¿Cómo conectar tu wallet?</h3>
      
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('desktop')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'desktop'
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
          }`}
        >
          💻 Desktop
        </button>
        <button
          onClick={() => setActiveTab('mobile')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'mobile'
              ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
          }`}
        >
          📱 Móvil
        </button>
      </div>

      {/* Desktop Instructions */}
      {activeTab === 'desktop' && (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💻 En tu Computadora</h4>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
              ReMi detectará automáticamente las wallets que tengas instaladas en tu navegador.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <strong>Instala una wallet:</strong> MetaMask, Coinbase Wallet, o cualquier extensión compatible
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <strong>Recarga la página:</strong> ReMi detectará automáticamente tu wallet
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-300 text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <strong>Haz clic en "Conectar":</strong> Se mostrará tu wallet recomendada
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Supported Wallets */}
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">🦊 Wallets Soportadas</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <span>🦊</span>
                <span className="text-gray-700 dark:text-gray-200">MetaMask</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🪙</span>
                <span className="text-gray-700 dark:text-gray-200">Coinbase Wallet</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💼</span>
                <span className="text-gray-700 dark:text-gray-200">TokenPocket</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🛡️</span>
                <span className="text-gray-700 dark:text-gray-200">Trust Wallet</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Instructions */}
      {activeTab === 'mobile' && (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">📱 En tu Móvil</h4>
            <p className="text-green-700 dark:text-green-300 text-sm mb-3">
              Usa WalletConnect para conectar cualquier wallet móvil compatible.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-300 text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <strong>Instala una wallet móvil:</strong> Rainbow, Trust Wallet, MetaMask Mobile, o cualquier wallet compatible
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-300 text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <strong>Haz clic en "Conectar Wallet":</strong> Se mostrará un código QR
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-300 text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <strong>Escanea el QR:</strong> Usa tu wallet móvil para escanear el código
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-300 text-xs font-bold">4</span>
                </div>
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-200">
                    <strong>Acepta la conexión:</strong> Confirma en tu wallet móvil
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Wallets */}
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">📱 Wallets Móviles</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <span>🌈</span>
                <span className="text-gray-700 dark:text-gray-200">Rainbow</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🛡️</span>
                <span className="text-gray-700 dark:text-gray-200">Trust Wallet</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🦊</span>
                <span className="text-gray-700 dark:text-gray-200">MetaMask Mobile</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🪙</span>
                <span className="text-gray-700 dark:text-gray-200">Coinbase Wallet</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* General Tips */}
      <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Consejos importantes</h4>
        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• <strong>Nunca compartas tu frase semilla</strong> con nadie</li>
          <li>• <strong>Usa solo redes de prueba</strong> (Base Sepolia, Celo Alfajores)</li>
          <li>• <strong>Obtén tokens de prueba</strong> de los faucets oficiales</li>
          <li>• <strong>Verifica siempre la URL</strong> antes de conectar tu wallet</li>
        </ul>
      </div>

      {/* Faucet Links */}
      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">🚰 Faucets para tokens de prueba</h4>
        <div className="space-y-2 text-sm">
          <a 
            href="https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            💰 Base Sepolia Faucet (Coinbase)
          </a>
          <a 
            href="https://faucet.celo.org/alfajores" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            🌿 Celo Alfajores Faucet
          </a>
        </div>
      </div>
    </div>
  );
} 