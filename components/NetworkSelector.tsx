'use client'

interface NetworkSelectorProps {
  network: 'baseSepolia' | 'celoAlfajores'
  onNetworkChange: (network: 'baseSepolia' | 'celoAlfajores') => void
}

export function NetworkSelector({ network, onNetworkChange }: NetworkSelectorProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => onNetworkChange('baseSepolia')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            network === 'baseSepolia'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Base Sepolia
        </button>
        <button
          onClick={() => onNetworkChange('celoAlfajores')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            network === 'celoAlfajores'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Celo Alfajores
        </button>
      </div>
    </div>
  )
}
