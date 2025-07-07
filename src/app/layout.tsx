import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { FarcasterAuth } from '../../components/FarcasterAuth';

const inter = Inter({ subsets: ['latin'] });

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta 
          name="fc:miniapp" 
          content={JSON.stringify({
            accountAssociation: {
              // Valores desde variables de entorno para seguridad
              header: process.env.NEXT_PUBLIC_FARCASTER_HEADER || "",
              payload: process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD || "", 
              signature: process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE || "",               
            },
            miniapp: {
              version: "1",
              name: "ReMi - Social Agenda Web3",
              description: "Tu agenda social con recompensas Web3, recordatorios y gamificación",
              iconUrl: "https://re-mi.vercel.app/icon.png",
              splash: {
                image: "https://re-mi.vercel.app/splash.png",
                backgroundColor: "#1e293b"
              },
              homeUrl: "https://re-mi.vercel.app/",
              author: "ReMi Team",
              tags: ["productivity", "web3", "social", "rewards", "tasks"],
              category: "Productivity",
              permissions: [
                "ethereum",
                "notifications"
              ],
              features: [
                "Task Management",
                "Weekly Goals", 
                "Achievements",
                "Web3 Rewards",
                "Calendar View",
                "Analytics"
              ],
              screenshotUrls: [
                "https://re-mi.vercel.app/screenshot.png"
              ],
              imageUrl: "https://re-mi.vercel.app/image.png",
              heroImageUrl: "https://re-mi.vercel.app/hero.png",
              splashImageUrl: "https://re-mi.vercel.app/splash.png",
              splashBackgroundColor: "#1e293b",
              castShareUrl: "https://farcaster.xyz/miniapps/Nf9G0Et26Mk9/remi---your-social-web3-schedule"
            }
          })}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
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

        
        {/* Additional Farcaster Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="ReMi - Social Agenda Web3" />
        <meta property="og:description" content="Tu agenda social con recompensas Web3, recordatorios y gamificación" />
        <meta property="og:url" content="https://re-mi.vercel.app/" />
        <meta property="og:image" content="https://re-mi.vercel.app/hero.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ReMi" />
        <meta property="og:locale" content="es_ES" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ReMi - Social Agenda Web3" />
        <meta name="twitter:description" content="Tu agenda social con recompensas Web3, recordatorios y gamificación" />
        <meta name="twitter:image" content="https://re-mi.vercel.app/hero.png" />
        <meta name="twitter:creator" content="@remi_app" />
        
        {/* Farcaster Frame Meta Tags */}
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://re-mi.vercel.app/hero.png" />
        <meta property="fc:frame:button:1" content="Abrir ReMi" />
        <meta property="fc:frame:post_url" content="https://re-mi.vercel.app/api/frame" />
        <meta property="fc:frame:input:text" content="false" />
        <meta property="fc:frame:state" content="initial" />
        
        {/* Farcaster SDK - Load only on client */}
        <script src="/farcaster-sdk.js" defer />
      </head>
      <body className={inter.className}>
        <Providers>
          <FarcasterAuth>
            {children}
          </FarcasterAuth>
        </Providers>
      </body>
    </html>
  );
}