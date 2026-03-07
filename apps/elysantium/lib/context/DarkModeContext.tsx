'use client';

import { useLocalStorageState } from '@/lib/hooks/useLocalStorageState';
import React, { createContext, useContext, useEffect } from 'react';

interface DarkModeContextValue {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue | undefined>(
  undefined
);

interface DarkModeProviderProps {
  children: React.ReactNode;
}

function DarkModeProvider({
  children
}: DarkModeProviderProps): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState<boolean>(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme:dark)').matches
      : false,
    'isDarkMode'
  );

  useEffect(
    function () {
      if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
      } else {
        document.documentElement.classList.add('light-mode');
        document.documentElement.classList.remove('dark-mode');
      }
    },
    [isDarkMode]
  );

  function toggleDarkMode(): void {
    setIsDarkMode((isDarkMode: boolean) => !isDarkMode);
  }

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

function useDarkMode(): DarkModeContextValue {
  const context = useContext(DarkModeContext);
  if (context === undefined)
    throw new Error('DarkModeContext was used outside of DarkModeProvider');
  return context;
}

export { DarkModeProvider, useDarkMode };
