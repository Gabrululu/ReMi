import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ReMi - Social Agenda Web3',
  description: 'Tu agenda social con recompensas Web3',
  manifest: '/manifest.json',
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
              ]
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
          src="https://unpkg.com/@farcaster/miniapp-sdk@0.1.4/dist/index.js"
          async
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}