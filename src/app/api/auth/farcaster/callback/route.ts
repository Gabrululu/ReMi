import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}?error=${encodeURIComponent(error)}`
    )
  }

  if (!code) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}?error=${encodeURIComponent('No se recibió código de autorización')}`
    )
  }

  try {
    // Intercambiar código por token de acceso
    const tokenResponse = await fetch('https://api.warpcast.com/v2/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: process.env.NEXT_PUBLIC_FARCASTER_CLIENT_ID || 're-mi-app',
        client_secret: process.env.FARCASTER_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: `${request.nextUrl.origin}/api/auth/farcaster/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Error al intercambiar código por token')
    }

    const tokenData = await tokenResponse.json()
    const { access_token } = tokenData

    // Obtener información del usuario
    const userResponse = await fetch('https://api.warpcast.com/v2/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    })

    if (!userResponse.ok) {
      throw new Error('Error al obtener información del usuario')
    }

    const userData = await userResponse.json()
    const { user } = userData

    // Redirigir de vuelta a la aplicación con los datos del usuario
    const redirectUrl = new URL(request.nextUrl.origin)
    redirectUrl.searchParams.set('farcaster_auth', 'success')
    redirectUrl.searchParams.set('fid', user.fid.toString())
    redirectUrl.searchParams.set('username', user.username)
    redirectUrl.searchParams.set('displayName', user.displayName || user.username)
    if (user.pfp?.url) {
      redirectUrl.searchParams.set('pfpUrl', user.pfp.url)
    }

    return NextResponse.redirect(redirectUrl.toString())

  } catch (error) {
    console.error('Error en callback de Farcaster:', error)
    return NextResponse.redirect(
      `${request.nextUrl.origin}?error=${encodeURIComponent('Error al procesar autenticación')}`
    )
  }
}
