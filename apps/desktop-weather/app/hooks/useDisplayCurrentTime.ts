import { useSyncExternalStore } from 'react';

const subscribe = (onStoreChange: () => void) => {
  const timer = setInterval(onStoreChange, 1000);
  return () => clearInterval(timer);
};

// Whole seconds, so the snapshot stays referentially stable between ticks.
const getSnapshot = (): number | null => Math.floor(Date.now() / 1000);

// The server has no meaningful "now" to render: whatever it picked would
// differ from the client's by the time hydration ran, which is a mismatch.
const getServerSnapshot = (): number | null => null;

export const useDisplayCurrentTime = (): Date | null => {
  const seconds = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return seconds === null ? null : new Date(seconds * 1000);
};
