'use client';

import { useEffect, useState } from 'react';

export default function DeathTransition() {
  const [phase, setPhase] = useState<'flash' | 'fade'>('flash');
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(0);

  useEffect(() => {
    // PHASE 1: BRIEF RED/WHITE FLASH (0-200ms)
    let raf: number;
    const start = performance.now();

    function animateFlash() {
      const elapsed = performance.now() - start;
      if (elapsed < 100) {
        // RAMP UP
        setFlashOpacity(Math.min(0.6, (elapsed / 100) * 0.6));
      } else if (elapsed < 200) {
        // RAMP DOWN
        setFlashOpacity(0.6 * (1 - (elapsed - 100) / 100));
      } else {
        setFlashOpacity(0);
        setPhase('fade');
        return;
      }
      raf = requestAnimationFrame(animateFlash);
    }
    raf = requestAnimationFrame(animateFlash);

    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (phase !== 'fade') return;

    // PHASE 2: GRADUAL DARK OVERLAY FADE-IN (200ms-2000ms)
    let raf: number;
    const start = performance.now();
    const duration = 1800;

    function animateFade() {
      const elapsed = performance.now() - start;
      const t = Math.min(elapsed / duration, 1);
      // EASE-IN CURVE FOR NATURAL DARKENING
      setFadeOpacity(t * t * 0.85);
      if (t < 1) {
        raf = requestAnimationFrame(animateFade);
      }
    }
    raf = requestAnimationFrame(animateFade);

    return () => cancelAnimationFrame(raf);
  }, [phase]);

  return (
    <>
      {/* RED/WHITE FLASH */}
      {flashOpacity > 0 && (
        <div
          className="fixed inset-0 z-40 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.8), rgba(200,50,50,0.6))',
            opacity: flashOpacity,
          }}
        />
      )}
      {/* DARK FADE OVERLAY */}
      <div
        className="fixed inset-0 z-40 pointer-events-none"
        style={{
          background: '#000',
          opacity: fadeOpacity,
        }}
      />
    </>
  );
}
