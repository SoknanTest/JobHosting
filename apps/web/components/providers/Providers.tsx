'use client';

import { NextIntlClientProvider } from 'next-intl';
import { StoreProvider } from './StoreProvider';
import { SocketProvider } from './SocketProvider';

export function Providers({ 
  children, 
  messages, 
  locale 
}: { 
  children: React.ReactNode;
  messages: any;
  locale: string;
}) {
  return (
    <StoreProvider>
      <SocketProvider>
        <NextIntlClientProvider messages={messages} locale={locale} timeZone="Asia/Phnom_Penh">
          {children}
        </NextIntlClientProvider>
      </SocketProvider>
    </StoreProvider>
  );
}
