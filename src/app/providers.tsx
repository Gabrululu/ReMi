'use client';

import type { ReactNode } from 'react';
import { AppKitProvider } from '../../lib/appkit-config';
import { MiniAppProvider } from '@neynar/react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MiniAppProvider analyticsEnabled={true}>
      <AppKitProvider>
        {children}
      </AppKitProvider>
    </MiniAppProvider>
  );
}