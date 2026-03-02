'use client';

import { useIsMounted } from '@shared-utils/hooks/client';
import type { FC, PropsWithChildren } from 'react';

export const ClientOnly: FC<PropsWithChildren> = ({ children }) => {
  const isMounted = useIsMounted();

  if (!isMounted) {
    return null;
  }

  return children;
};
