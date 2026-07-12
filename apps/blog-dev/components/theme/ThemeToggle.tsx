'use client';

import { easeOut } from '@/utils/motion';
import { AnimatePresence, motion } from '@repo/ui/animation';
import { Moon, Sun } from '@repo/ui/icons/lucide';
import { JSX } from 'react';

import { useTheme } from './ThemeProvider';

const ThemeToggle = (): JSX.Element => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="text-white-100 relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-(--chip-bg-hover)"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.25, ease: easeOut }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
