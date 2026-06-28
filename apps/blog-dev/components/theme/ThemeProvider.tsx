'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent<HTMLElement>) => void;
}

const STORAGE_KEY = 'theme';
// ONE YEAR, IN SECONDS.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const applyTheme = (theme: Theme): void => {
  document.documentElement.setAttribute('data-theme', theme);
  // PERSIST IN A COOKIE SO THE SERVER RENDERS THE CORRECT THEME ON THE NEXT
  // request (no flash, no inline script).
  document.cookie = `${STORAGE_KEY}=${theme};path=/;max-age=${COOKIE_MAX_AGE};samesite=lax`;
};

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

export const ThemeProvider = ({
  initialTheme,
  children
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}): React.ReactElement => {
  // THE SERVER SETS DATA-THEME FROM THE COOKIE, SO THE INITIAL CLIENT STATE MATCHES THE RENDERED HTML — NO FLASH, NO POST-MOUNT SETSTATE.
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const toggleTheme = useCallback(
    (event?: React.MouseEvent<HTMLElement>) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';

      const doc = document as DocumentWithViewTransition;
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (!doc.startViewTransition || prefersReducedMotion) {
        setTheme(next);
        applyTheme(next);
        return;
      }

      const origin = (() => {
        if (!event) {
          return { x: window.innerWidth, y: 0 };
        }
        const target = event.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };
      })();

      const endRadius = Math.hypot(
        Math.max(origin.x, window.innerWidth - origin.x),
        Math.max(origin.y, window.innerHeight - origin.y)
      );

      const transition = doc.startViewTransition(() => {
        flushSync(() => {
          setTheme(next);
          applyTheme(next);
        });
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${origin.x}px ${origin.y}px)`,
                `circle(${endRadius}px at ${origin.x}px ${origin.y}px)`
              ]
            },
            {
              duration: 700,
              easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
              pseudoElement: '::view-transition-new(root)'
            }
          );
        })
        .catch(() => {
          /* NOOP — TRANSITION MAY BE SKIPPED */
        });
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
