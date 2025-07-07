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
              address: "0x...", // Reemplaza con tu address
              payload: "...", // Reemplaza con tu payload
              signature: "...", // Reemplaza con tu signature
              timestamp: 1234567890 // Reemplaza con tu timestamp
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
            }
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
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}