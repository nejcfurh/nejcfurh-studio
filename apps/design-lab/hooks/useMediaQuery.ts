import { useEffect, useState } from 'react';

/**
 * Tracks whether a CSS media query currently matches. Returns `false` on the
 * server and first client render (so SSR markup stays stable), then updates
 * after mount and on every change.
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMatches(mql.matches);

    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};
