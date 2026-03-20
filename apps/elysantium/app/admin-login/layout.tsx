'use client';

import { DarkModeProvider } from '@/lib/context/DarkModeContext';
import { QueryProvider } from '@repo/react-query';
import { Toaster } from 'react-hot-toast';

export default function AdminLoginLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <DarkModeProvider>
      <QueryProvider>
        {children}
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: '8px' }}
          toastOptions={{
            success: {
              duration: 3000
            },
            error: {
              duration: 5000
            },
            style: {
              fontSize: '16px',
              maxWidth: '500px',
              padding: '16px 24px',
              backgroundColor: 'var(--color-grey-0)',
              color: 'var(--color-grey-700)'
            }
          }}
        />
      </QueryProvider>
    </DarkModeProvider>
  );
}
