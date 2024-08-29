// RTL.tsx
import React, { ReactNode } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';

interface RTLProps {
  children: ReactNode;
}

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [rtlPlugin],
});

export function RTL({ children }: RTLProps) {
  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
}
