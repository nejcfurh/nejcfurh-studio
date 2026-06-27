'use client';

import { cn } from '@/utils/utils';
import { motion } from '@repo/ui/animation';

export type TransitionMode = 'curve' | 'stairs';

const MODES: { value: TransitionMode; label: string }[] = [
  { value: 'curve', label: 'Curve' },
  { value: 'stairs', label: 'Stairs' }
];

interface TransitionToggleProps {
  mode: TransitionMode;
  onChange: (mode: TransitionMode) => void;
}

export default function TransitionToggle({
  mode,
  onChange
}: TransitionToggleProps) {
  return (
    <div className="fixed top-20 left-1/2 z-100 flex -translate-x-1/2 items-center gap-1 rounded-full bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur-md sm:top-5 sm:right-5 sm:left-auto sm:translate-x-0">
      {MODES.map((m) => {
        const active = mode === m.value;

        return (
          <button
            key={m.value}
            type="button"
            onClick={() => onChange(m.value)}
            aria-pressed={active}
            className={cn(
              'relative cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300',
              active ? 'text-black' : 'text-white/80 hover:text-white'
            )}
          >
            {active && (
              <motion.span
                layoutId="transition-toggle-pill"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
