import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Frame interaction received:', body);

    // Redirect to the Mini App
    return NextResponse.json({
      frames: [
        {
          image: 'https://re-mi.vercel.app/hero.png',
          buttons: [
            {
              label: 'Abrir ReMi',
              action: 'link',
              target: 'https://re-mi.vercel.app/'
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error processing frame:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  // Return the initial frame
  return NextResponse.json({
    frames: [
      {
        image: 'https://re-mi.vercel.app/hero.png',
        buttons: [
          {
            label: 'Abrir ReMi',
            action: 'link',
            target: 'https://re-mi.vercel.app/'
          }
        ]
      }
    ]
  });
} 