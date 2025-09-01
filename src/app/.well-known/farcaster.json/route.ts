import { NextResponse } from 'next/server';

export async function GET() {
  const header = process.env.NEXT_PUBLIC_FARCASTER_HEADER;
  const payload = process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD;
  const signature = process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE;
  
  if (!header || !payload || !signature) {
    return NextResponse.json(
      { error: 'Farcaster domain association incompleta' },
      { status: 500 }
    );
  }

  const manifest = {
    accountAssociation: { header, payload, signature },
    frame: {
      version: '1',
      name: 'ReMi - Your Social Web3 Schedule',
      iconUrl: 'https://re-mi.vercel.app/icon.png',
      homeUrl: 'https://re-mi.vercel.app',
      imageUrl: 'https://re-mi.vercel.app/hero.png',
      buttonTitle: '🚀 Abrir ReMi',
      splashImageUrl: 'https://re-mi.vercel.app/splash.png',
      splashBackgroundColor: '#1e293b',
      webhookUrl: 'https://re-mi.vercel.app/api/webhook',
    },
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
