import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'
import Script from 'next/script'
import { getFarcasterEmbedJSON } from '../../lib/farcaster-embed'

// Cargar el componente simple de ready
const FarcasterReady = dynamic(
  () => import('../../components/FarcasterReady').then(m => ({ default: m.FarcasterReady })),
  { 
    ssr: false,
    loading: () => null
  }
)


const ProvidersNoSSR = dynamic(
  () => import('./providers').then(m => m.Providers),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando ReMi...</p>
        </div>
      </div>
    )
  }
)

const NeynarProvider = dynamic(
  () => import('../../components/NeynarProvider').then(m => ({ default: m.NeynarProvider })),
  { 
    ssr: false,
    loading: () => null
  }
)

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReMi - Social Agenda Web3',
  description: 'Tu agenda social con recompensas Web3, recordatorios y gamificación',
  manifest: '/manifest.json',
  openGraph: {
    title: 'ReMi - Social Agenda Web3',
    description: 'Tu agenda social con recompensas Web3, recordatorios y gamificación',
    url: 'https://re-mi.vercel.app/',
    siteName: 'ReMi',
    images: [
      {
        url: 'https://re-mi.vercel.app/hero.png',
        width: 1200,
        height: 630,
        alt: 'ReMi - Social Agenda Web3',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReMi - Social Agenda Web3',
    description: 'Tu agenda social con recompensas Web3, recordatorios y gamificación',
    images: ['https://re-mi.vercel.app/hero.png'],
    creator: '@remi_app',
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://re-mi.vercel.app/hero.png',
    'fc:frame:button:1': 'Abrir ReMi',
    'fc:frame:post_url': 'https://re-mi.vercel.app/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconnect hint para optimizar performance */}
        <link rel="preconnect" href="https://auth.farcaster.xyz" />
        
        {/* Farcaster Mini App Meta Tags */}
        <meta name="farcaster:mini-app" content="true" />
        <meta name="farcaster:mini-app:name" content="ReMi - Social Agenda Web3" />
        <meta name="farcaster:mini-app:description" content="Tu agenda social con recompensas Web3, recordatorios y gamificación" />
        <meta name="farcaster:mini-app:icon" content="https://re-mi.vercel.app/icon.png" />
        <meta name="farcaster:mini-app:splash-image" content="https://re-mi.vercel.app/splash.png" />
        <meta name="farcaster:mini-app:splash-background-color" content="#1e293b" />
        <meta name="farcaster:mini-app:primary-color" content="#3b82f6" />
        <meta name="farcaster:mini-app:secondary-color" content="#8b5cf6" />
        <meta name="farcaster:mini-app:version" content="0.1.1" />
        <meta name="farcaster:mini-app:author" content="ReMi Team" />
        <meta name="farcaster:mini-app:author-url" content="https://re-mi.vercel.app" />

        {/* Farcaster Mini App Embed - REQUERIDO según la especificación */}
        <meta
          name="fc:miniapp"
          content={getFarcasterEmbedJSON()}
        />

        {/* Opcional: back-compat, MISMO CONTENIDO */}
        <meta
          name="fc:frame"
          content={getFarcasterEmbedJSON()}
        />

        {/* OG / Twitter */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ReMi - Social Agenda Web3" />
        <meta
          property="og:description"
          content="Tu agenda social con recompensas Web3, recordatorios y gamificación"
        />
        <meta property="og:url" content="https://re-mi.vercel.app/" />
        <meta property="og:image" content="https://re-mi.vercel.app/hero.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ReMi" />
        <meta property="og:locale" content="es_ES" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ReMi - Social Agenda Web3" />
        <meta
          name="twitter:description"
          content="Tu agenda social con recompensas Web3, recordatorios y gamificación"
        />
        <meta name="twitter:image" content="https://re-mi.vercel.app/hero.png" />
        <meta name="twitter:creator" content="@remi_app" />

        {/* Farcaster Frame Meta Tags - ELIMINADOS para evitar duplicados */}
      </head>

      <body className={inter.className} suppressHydrationWarning>
        {/* Componente simple para llamar ready() */}
        <FarcasterReady />
        
        {/* Script para el tema oscuro - se ejecuta solo en el cliente */}
        <Script
          id="theme-switcher"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
                  try {
                    var theme = localStorage.getItem('theme');
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (theme === 'dark' || (!theme && prefersDark)) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  } catch (e) {}
                }
              })();
            `,
          }}
        />
        
        {/* ✅ Providers solo en cliente */}
        <ProvidersNoSSR>
          {children}
        </ProvidersNoSSR>
      </body>
    </html>
  )
}
