'use client';

import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig
} from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';

export const defaultQueryClientOptions: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 0
    }
  }
};

interface QueryProviderProps {
  children: ReactNode;
  queryClientOptions?: QueryClientConfig;
}

export function QueryProvider({
  children,
  queryClientOptions
}: QueryProviderProps): React.ReactNode {
  const [queryClient] = useState(
    () => new QueryClient(queryClientOptions ?? defaultQueryClientOptions)
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
