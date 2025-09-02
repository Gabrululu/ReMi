'use client'

import { useEffect, useState } from 'react'

export interface MiniAppContextState<T = any> {
  isMiniApp: boolean | null
  context: T | null
  error: string | null
}

export function useMiniAppEnv<T = any>(): MiniAppContextState<T> {
  const [isMiniApp, setIsMiniApp] = useState<boolean | null>(null)
  const [context, setContext] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { sdk } = await import('@farcaster/miniapp-sdk')
        const inside = await sdk.isInMiniApp()
        if (!mounted) return
        setIsMiniApp(inside)
        if (inside) {
          try {
            const ctx = await sdk.context.get()
            if (!mounted) return
            setContext(ctx as T)
            // ready() ya se llama en FarcasterReady component
          } catch (e) {
            if (!mounted) return
            setError('No se pudo obtener el contexto del Mini App')
          }
        }
      } catch (e: any) {
        if (!mounted) return
        setIsMiniApp(false)
        setError(e?.message || 'Error detectando Mini App')
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  return { isMiniApp, context, error }
}
