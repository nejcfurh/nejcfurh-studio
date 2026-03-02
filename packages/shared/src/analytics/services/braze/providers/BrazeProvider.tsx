'use client';

import type {
  AnalyticBrazeConfig,
  BrazeContextState
} from '@shared-analytics/services/braze/types';
import { createContext, useMemo } from 'react';

import { BrazeClientSession } from '../braze.client';

export const BrazeContext = createContext<BrazeContextState | null>(null);

interface BrazeProviderProps {
  children: React.ReactNode;
  config?: AnalyticBrazeConfig;
}

export const BrazeProvider = ({
  children,
  config
}: BrazeProviderProps): React.ReactNode => {
  const brazeContextState = useMemo<BrazeContextState | null>(() => {
    if (!config) {
      return null;
    }

    return {
      brazeSession: new BrazeClientSession(config)
    };
  }, [config]);

  return (
    <BrazeContext.Provider value={brazeContextState}>
      {children}
    </BrazeContext.Provider>
  );
};
