import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Verificar si estamos en un contexto de Farcaster Mini App
    const userAgent = request.headers.get('user-agent') || '';
    const isFarcasterApp = userAgent.includes('Farcaster') || 
                          request.headers.get('x-farcaster-auth') === 'true';

    if (!isFarcasterApp) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // En un entorno real, aquí verificarías el token de autenticación
    // Por ahora, simulamos un usuario de Farcaster
    const mockUser = {
      fid: 12345, // Farcaster ID
      username: 'usuario_remi',
      displayName: 'Usuario ReMi',
      avatar: 'https://via.placeholder.com/150',
      verified: true
    };

    return NextResponse.json(mockUser);
  } catch (error) {
    console.error('Error en autenticación:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
} 