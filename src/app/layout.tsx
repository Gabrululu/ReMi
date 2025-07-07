import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

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
              // Aquí van los valores firmados que obtuviste de Farcaster
              header: "eyJmaWQiOjQ3MzYyNiwidHlwZSI6ImF1dGgiLCJrZXkiOiIweGUzNzRDZDdDRGFDQmRkYzlmMjhFQkIzMjU2NTU4Mjk0ZWJkMEE0RUIifQ",
              payload: "eyJkb21haW4iOiJyZS1taS52ZXJjZWwuYXBwIn0", 
              signature: "mHa+YYxvJkorqP5CnUAE6O64m9QNsRW9/iPRUpGynNBBoQ5ZVW5+B+AN8mQzaf1x5uswsJktFLaPM/7PMz7+Ohw=",               
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
              // Nuevos campos agregados
              screenshotUrls: [
                "https://re-mi.vercel.app/screenshot.png"
              ],
              imageUrl: "https://re-mi.vercel.app/image.png",
              heroImageUrl: "https://re-mi.vercel.app/hero.png",
              splashImageUrl: "https://re-mi.vercel.app/splash.png",
              splashBackgroundColor: "#1e293b",
              castShareUrl: "https://farcaster.xyz/miniapps/Nf9G0Et26Mk9/remi---your-social-web3-schedule"
            },
            // Campos requeridos para Frames
            version: "next",
            imageUrl: "https://re-mi.vercel.app/splash.png",
            button: "Abrir ReMi",
            aspectRatio: "1.91:1"
          })}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Farcaster Mini App SDK */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize Farcaster SDK
              (function() {
                if (typeof window !== 'undefined') {
                  // Create a simple ready function
                  window.farcaster = {
                    ready: function() {
                      console.log('Farcaster ready called');
                      // Dispatch custom event
                      window.dispatchEvent(new CustomEvent('farcaster-ready'));
                    },
                    sdk: {
                      actions: {
                        ready: function() {
                          console.log('Farcaster SDK actions ready called');
                          window.dispatchEvent(new CustomEvent('farcaster-ready'));
                        }
                      }
                    }
                  };
                }
              })();
            `
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
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}