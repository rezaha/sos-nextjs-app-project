// RTL.tsx
import React, { ReactNode } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';

// theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl', // تنظیم جهت RTL
  // شما می‌توانید سایر تنظیمات تم مانند پالت رنگ‌ها را اینجا اضافه کنید
});

export default theme;
