'use client';

import AppLayout from '@/components/admin/ui/AppLayout';
import ProtectedRoute from '@/components/admin/ui/ProtectedRoute';
import { DarkModeProvider } from '@/lib/context/DarkModeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0
          }
        }
      })
  );

  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ProtectedRoute>
          <AppLayout>{children}</AppLayout>
        </ProtectedRoute>
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
      </QueryClientProvider>
    </DarkModeProvider>
  );
}
