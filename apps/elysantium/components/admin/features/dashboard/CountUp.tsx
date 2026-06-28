'use client';

import { animate, useReducedMotion } from '@repo/ui/animation';
import { useEffect, useState } from 'react';

interface CountUpProps {
  value: number;
  format?: (n: number) => string;
}

// Animates a number from 0 up to `value` on mount. Respects reduced motion.
function CountUp({ value, format }: CountUpProps): React.ReactElement {
  const reduce = useReducedMotion();
  // Initial state already equals `value` when reduced motion is on, so the
  // effect can no-op there (no synchronous setState inside the effect).
  const [display, setDisplay] = useState<number>(reduce ? value : 0);

  useEffect(() => {
    if (reduce) return;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.215, 0.61, 0.355, 1],
      onUpdate: (v) => setDisplay(v)
    });
    return () => controls.stop();
  }, [value, reduce]);

  return <>{format ? format(display) : Math.round(display).toLocaleString()}</>;
}

export default CountUp;
