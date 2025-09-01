// Configuración para Farcaster Mini Apps
export const farcasterConfig = {
  miniApp: {
    name: 'ReMi - Social Agenda Web3',
    description: 'Tu agenda social con recompensas Web3, recordatorios y gamificación',
    icon: 'https://re-mi.vercel.app/icon.png',
    splashImage: 'https://re-mi.vercel.app/splash.png',
    splashBackgroundColor: '#1e293b',
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    version: '0.1.1',
    author: 'ReMi Team',
    authorUrl: 'https://re-mi.vercel.app',
    categories: ['productivity', 'social', 'utilities'],
    tags: ['web3', 'productivity', 'social', 'rewards', 'reminders'],
    permissions: [
      'notifications',
      'wallet_connect',
      'farcaster_auth'
    ],
    features: [
      'task_management',
      'rewards_system',
      'social_integration',
      'web3_wallet'
    ]
  },
  frame: {
    version: 'vNext',
    image: 'https://re-mi.vercel.app/hero.png',
    button1: '🚀 Proof ReMi',
    postUrl: 'https://re-mi.vercel.app/api/frame',
    inputText: false,
    state: 'initial'
  },
  og: {
    title: 'ReMi - Social Agenda Web3',
    description: 'Tu agenda social con recompensas Web3, recordatorios y gamificación',
    url: 'https://re-mi.vercel.app/',
    image: 'https://re-mi.vercel.app/hero.png',
    siteName: 'ReMi',
    locale: 'es_ES'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReMi - Social Agenda Web3',
    description: 'Tu agenda social con recompensas Web3, recordatorios y gamificación',
    image: 'https://re-mi.vercel.app/hero.png',
    creator: '@remi_app'
  }
};
