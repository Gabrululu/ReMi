'use client'

import { useEffect, useState, useCallback } from 'react'

export interface UiPrefs {
  showMissions: boolean
  showRanking: boolean
}

const DEFAULT_PREFS: UiPrefs = {
  showMissions: true,
  showRanking: true,
}

const KEY = 'remi_ui_prefs'

export function useUiPrefs() {
  const [prefs, setPrefs] = useState<UiPrefs>(DEFAULT_PREFS)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) })
    } catch {}
  }, [])

  const update = useCallback((next: Partial<UiPrefs>) => {
    setPrefs((prev) => {
      const merged = { ...prev, ...next }
      try { localStorage.setItem(KEY, JSON.stringify(merged)) } catch {}
      return merged
    })
  }, [])

  return { prefs, update }
}


