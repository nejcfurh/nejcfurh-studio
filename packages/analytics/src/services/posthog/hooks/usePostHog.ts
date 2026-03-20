import { useContext } from 'react';

import type { PostHogClientSession } from '../posthog.client';
import { PostHogContext } from '../providers/PostHogProvider';

type usePostHogType = () => {
  posthogSession?: PostHogClientSession;
};
export const usePostHog: usePostHogType = () => {
  const posthogContext = useContext(PostHogContext);

  return {
    posthogSession: posthogContext?.posthogSession
  };
};
