'use client'

// Helper para compartir contenido en Farcaster
// - En Mini App: usa el SDK para abrir el composer nativo
// - Fuera de Farcaster: fallback a Warpcast compose URL con el texto prellenado

export async function shareToFarcaster(options: { text: string; url?: string }) {
  const { text, url } = options

  try {
    const { sdk } = await import('@farcaster/miniapp-sdk')

    const inside = await sdk.isInMiniApp()
    if (inside) {
      // Preferir openComposer si está disponible
      // @ts-ignore: API del SDK puede variar por versión
      if (sdk.actions?.openComposer) {
        // @ts-ignore
        await sdk.actions.openComposer({ text, url })
        return
      }
      // Fallback: acción share genérica
      // @ts-ignore
      if (sdk.actions?.share) {
        // @ts-ignore
        await sdk.actions.share({ text, url })
        return
      }
    }
  } catch (_) {
    // ignorar, seguimos con fallback
  }

  // Fallback universal: Warpcast compose URL
  const base = 'https://warpcast.com/~/compose'
  const params = new URLSearchParams({ text })
  if (url) {
    // Warpcast acepta embeds[] para previsualizaciones
    params.append('embeds[]', url)
  }
  const composeUrl = `${base}?${params.toString()}`
  if (typeof window !== 'undefined') {
    window.open(composeUrl, '_blank')
  }
}


