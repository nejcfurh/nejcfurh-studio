'use client';

import { useRef, useEffect } from 'react';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameStore } from '@/store/gameStore';

export default function GameLoopRunner() {
  const joystickXRef = useRef(0);
  const tapSteerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Touch handling — tap-to-steer with gradient steering + inverse flap strength
  useEffect(() => {
    const handler = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const state = useGameStore.getState();

      // Only handle canvas touches (UI buttons handle themselves)
      if (target.tagName !== 'CANVAS') return;

      // Any tap while feeding/drinking → fly away (after landing animation)
      if (state.gameState === 'feeding' || state.gameState === 'drinking') {
        if (state.perchTime >= 2) state.flyAway();
        return;
      }

      // Tap-steer: gradient steering + inverse flap strength
      // Center of screen = no turn, full flap
      // Edge of screen = max turn, minimal flap
      const touch = e.touches[0];
      const w = window.innerWidth;
      const x = touch.clientX;
      const center = w / 2;

      // -1 (left edge) to +1 (right edge)
      const normalized = (x - center) / center;
      // How far from center (0 = center, 1 = edge)
      const edgeness = Math.abs(normalized);

      // Steering: gradient from 0 at center to full at edges
      // Negative = turn right, positive = turn left (camera-behind perspective)
      joystickXRef.current = -normalized;

      // Flap strength: 1.0 at center, 0.25 at edges
      useGameStore.setState({ flapStrength: 1.0 - edgeness * 0.75 });

      // Clear previous timer
      if (tapSteerTimerRef.current) clearTimeout(tapSteerTimerRef.current);

      // Reset steering after a short duration
      tapSteerTimerRef.current = setTimeout(() => {
        joystickXRef.current = 0;
        tapSteerTimerRef.current = null;
      }, 300);

      // Flap
      state.flap();
    };

    window.addEventListener('touchstart', handler);
    return () => {
      window.removeEventListener('touchstart', handler);
      if (tapSteerTimerRef.current) clearTimeout(tapSteerTimerRef.current);
    };
  }, []);

  useGameLoop(joystickXRef);

  return null;
}
