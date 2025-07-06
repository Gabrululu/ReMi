// SDK de Neynar para Farcaster
export class FarcasterService {
    private apiKey: string;
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }
  
    async publishCast(message: string): Promise<{ success: boolean; message: string }> {
      // Implementación básica - en producción usarías el SDK real
      console.log('Publishing cast:', message);
      return { success: true, message };
    }
  
    async getUserInfo(fid: string): Promise<{ fid: string; username: string }> {
      // Obtener información del usuario
      console.log('Getting user info for FID:', fid);
      return { fid, username: 'user' + fid };
    }
  }