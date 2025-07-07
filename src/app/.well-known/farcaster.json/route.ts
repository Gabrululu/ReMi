import { NextResponse } from 'next/server';

export async function GET() {
  // Obtener las variables de entorno
  const header = process.env.NEXT_PUBLIC_FARCASTER_HEADER;
  const payload = process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD;
  const signature = process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE;

  // Verificar que las variables estén configuradas
  if (!header || !payload || !signature) {
    console.error('Faltan variables de entorno de Farcaster');
    return NextResponse.json(
      { error: 'Configuración de Farcaster incompleta' },
      { status: 500 }
    );
  }

  // Generar el manifest dinámicamente
  const manifest = {
    accountAssociation: {
      header,
      payload,
      signature
    },
    frame: {
      version: "1",
      name: "ReMi - Your Social Web3 Schedule",
      iconUrl: "https://re-mi.vercel.app/icon.png",
      homeUrl: "https://re-mi.vercel.app",
      imageUrl: "https://re-mi.vercel.app/image.png",
      buttonTitle: "Check this out",
      splashImageUrl: "https://re-mi.vercel.app/splash.png",
      splashBackgroundColor: "#eeccff",
      webhookUrl: "https://re-mi.vercel.app/api/webhook"
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600' // Cache por 1 hora
    }
  });
} 