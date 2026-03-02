'use client';

import { BrazeContext } from '@shared-analytics/services/braze/providers/BrazeProvider';
import { useContext, useState } from 'react';

type useBrazeType = {
  (): {
    isLoading: boolean;
    initialize(): void;
    addToEmailSubscriptionGroup: (params: {
      email: string;
      subscriptionGroupId: string;
    }) => Promise<void>;
  };
};

export const useBraze: useBrazeType = () => {
  const brazeContextState = useContext(BrazeContext);
  const [isLoading, setIsLoading] = useState(false);

  const addToEmailSubscriptionGroup = async (params: {
    email: string;
    subscriptionGroupId: string;
  }): Promise<void> => {
    const { email, subscriptionGroupId } = params;

    setIsLoading(true);

    try {
      await brazeContextState?.brazeSession?.addToEmailSubscriptionGroup({
        email,
        subscriptionGroupId
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initialize = (): void => {
    brazeContextState?.brazeSession?.openSession();
  };

  return {
    isLoading,
    initialize,
    addToEmailSubscriptionGroup
  };
};
