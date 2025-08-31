import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'

// ⛳️ Cargar Providers SOLO en cliente (evita SSR de SDKs que tocan window/indexedDB)
const ProvidersNoSSR = dynamic(
  () => import('./providers').then(m => m.Providers),
  { ssr: false }
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
        <meta
          name="fc:frame"
          content={JSON.stringify({
            version: 'next',
            imageUrl: 'https://re-mi.vercel.app/hero.png',
            button: {
              title: '🚀 Abrir ReMi',
              action: {
                type: 'launch_frame',
                name: 'ReMi - Social Agenda Web3',
                url: 'https://re-mi.vercel.app',
                splashImageUrl: 'https://re-mi.vercel.app/splash.png',
                splashBackgroundColor: '#1e293b',
              },
            },
          })}
        />

        <script
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

        {/* Farcaster Frame Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://re-mi.vercel.app/hero.png" />
        <meta property="fc:frame:button:1" content="Abrir ReMi" />
        <meta property="fc:frame:post_url" content="https://re-mi.vercel.app/api/frame" />
        <meta property="fc:frame:input:text" content="false" />
        <meta property="fc:frame:state" content="initial" />
      </head>

      <body className={inter.className}>
        {/* ✅ Providers solo en cliente */}
        <ProvidersNoSSR>{children}</ProvidersNoSSR>
      </body>
    </html>
  )
}
