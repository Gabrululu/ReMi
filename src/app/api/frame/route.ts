import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData, trustedData } = body;

    // Procesar la interacción del frame
    console.log('Frame interaction:', { untrustedData, trustedData });

    // Redirigir a la aplicación principal
    return NextResponse.json({
      success: true,
      redirectUrl: 'https://re-mi.vercel.app/'
    });
  } catch (error) {
    console.error('Error processing frame:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET() {
  // Retornar el frame HTML
  const frameHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>ReMi - Social Agenda Web3</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://re-mi.vercel.app/hero.png" />
        <meta property="fc:frame:button:1" content="Abrir ReMi" />
        <meta property="fc:frame:post_url" content="https://re-mi.vercel.app/api/frame" />
      </head>
      <body>
        <h1>ReMi - Social Agenda Web3</h1>
        <p>Tu agenda social con recompensas Web3</p>
      </body>
    </html>
  `;

  return new NextResponse(frameHtml, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 