import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar si estamos en un contexto de Farcaster Mini App
    const userAgent = request.headers.get('user-agent') || '';
    const isFarcasterApp = userAgent.includes('Farcaster') || 
                          request.headers.get('x-farcaster-auth') === 'true' ||
                          request.headers.get('x-farcaster-context') === 'mini-app';

    if (!isFarcasterApp) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener el FID del usuario desde los headers de Farcaster
    const farcasterFid = request.headers.get('x-farcaster-fid');
    const farcasterUsername = request.headers.get('x-farcaster-username');
    const farcasterDisplayName = request.headers.get('x-farcaster-display-name');

    // Si tenemos credenciales de Neynar, usar la API real
    const neynarApiKey = process.env.NEYNAR_API_KEY;
    const neynarSignerUuid = process.env.NEYNAR_SIGNER_UUID;

    if (neynarApiKey && farcasterFid) {
      try {
        // Usar la API de Neynar para obtener información real del usuario
        const response = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${farcasterFid}`, {
          headers: {
            'api_key': neynarApiKey,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const user = data.users?.[0];
          
          if (user) {
            return NextResponse.json({
              fid: parseInt(farcasterFid),
              username: user.username,
              displayName: user.display_name,
              avatar: user.pfp_url,
              verified: user.verified,
              followerCount: user.follower_count,
              followingCount: user.following_count
            });
          }
        }
      } catch (apiError) {
        console.error('Error obteniendo datos de Neynar:', apiError);
      }
    }

    // Fallback: usar datos de los headers o mock
    const user = {
      fid: farcasterFid ? parseInt(farcasterFid) : 12345,
      username: farcasterUsername || 'usuario_remi',
      displayName: farcasterDisplayName || 'Usuario ReMi',
      avatar: 'https://via.placeholder.com/150',
      verified: true,
      followerCount: 156,
      followingCount: 89
    };

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error en autenticación:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 