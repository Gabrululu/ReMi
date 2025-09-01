'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function FarcasterReady() {
  useEffect(() => {
    (async () => {
      try {
        // Señal al cliente Farcaster: la UI está lista
        await sdk.actions.ready();
        // opcional: console.info('Mini App ready');
      } catch (e) {
        // opcional: console.error('sdk.actions.ready() failed', e);
      }
    })();
  }, []);

  return null;
}
