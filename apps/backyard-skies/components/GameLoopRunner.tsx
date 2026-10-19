'use client';

import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameStore } from '@/store/gameStore';
import {
  GLIDE_HOLD_DELAY,
  PERCH_MIN_TIME,
  TAP_STEER_DURATION
} from '@/utils/constants';
import { useEffect, useRef } from 'react';

function isPlaying(gameState: string): boolean {
  return (
    gameState === 'flight' ||
    gameState === 'feeding' ||
    gameState === 'drinking'
  );
}

interface Hold {
  pointerId: number;
  canvas: HTMLCanvasElement;
  clientX: number;
  gliding: boolean;
  timer: ReturnType<typeof setTimeout> | null;
}

/** -1 at the left edge of the canvas, 0 at the centre, +1 at the right edge. */
function horizontalOffset(canvas: HTMLCanvasElement, clientX: number): number {
  const rect = canvas.getBoundingClientRect();
  const center = rect.width / 2;
  const offset = (clientX - rect.left - center) / center;
  return Math.max(-1, Math.min(1, offset));
}

export default function GameLoopRunner() {
  const joystickXRef = useRef(0);
  const tapSteerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdRef = useRef<Hold | null>(null);

  useEffect(() => {
    // Negative = turn right, positive = turn left (camera-behind perspective)
    const glideSteer = (hold: Hold) =>
      -horizontalOffset(hold.canvas, hold.clientX);

    function endHold() {
      const hold = holdRef.current;
      if (!hold) return;
      holdRef.current = null;
      if (hold.timer) clearTimeout(hold.timer);
      if (hold.gliding) {
        useGameStore.getState().setGliding(false);
        if (!tapSteerTimerRef.current) joystickXRef.current = 0;
      }
    }

    function startGlide(hold: Hold) {
      hold.timer = null;
      const state = useGameStore.getState();
      if (state.gameState !== 'flight' || state.isPaused) return;
      hold.gliding = true;
      state.setGliding(true);
      // The hold now owns steering, so the tap's pulse must not zero it.
      if (tapSteerTimerRef.current) {
        clearTimeout(tapSteerTimerRef.current);
        tapSteerTimerRef.current = null;
      }
      joystickXRef.current = glideSteer(hold);
    }

    function handleTap(canvas: HTMLCanvasElement, clientX: number) {
      const state = useGameStore.getState();

      // Any tap while feeding/drinking → fly away (after landing animation)
      if (state.gameState === 'feeding' || state.gameState === 'drinking') {
        if (state.perchTime >= PERCH_MIN_TIME) state.flyAway();
        return;
      }

      // Tap-steer: gradient steering + inverse flap strength
      // Center of screen = no turn, full flap
      // Edge of screen = max turn, minimal flap
      const normalized = horizontalOffset(canvas, clientX);
      joystickXRef.current = -normalized;

      // Flap strength: 1.0 at center, 0.25 at edges
      useGameStore.setState({
        flapStrength: 1.0 - Math.abs(normalized) * 0.75
      });

      if (tapSteerTimerRef.current) clearTimeout(tapSteerTimerRef.current);
      tapSteerTimerRef.current = setTimeout(() => {
        tapSteerTimerRef.current = null;
        const hold = holdRef.current;
        joystickXRef.current = hold?.gliding ? glideSteer(hold) : 0;
      }, TAP_STEER_DURATION * 1000);

      state.flap();
    }

    const pointerDownHandler = (e: PointerEvent) => {
      // Only handle canvas interactions (UI buttons handle themselves)
      if (!(e.target instanceof HTMLCanvasElement)) return;
      if (useGameStore.getState().isPaused) return;

      handleTap(e.target, e.clientX);

      if (holdRef.current) return;
      const hold: Hold = {
        pointerId: e.pointerId,
        canvas: e.target,
        clientX: e.clientX,
        gliding: false,
        timer: null
      };
      hold.timer = setTimeout(() => startGlide(hold), GLIDE_HOLD_DELAY * 1000);
      holdRef.current = hold;
    };

    const pointerMoveHandler = (e: PointerEvent) => {
      const hold = holdRef.current;
      if (!hold || hold.pointerId !== e.pointerId) return;
      hold.clientX = e.clientX;
      if (!hold.gliding) return;
      const state = useGameStore.getState();
      if (state.isPaused || state.gameState !== 'flight') {
        endHold();
        return;
      }
      if (!tapSteerTimerRef.current) joystickXRef.current = glideSteer(hold);
    };

    const pointerUpHandler = (e: PointerEvent) => {
      if (holdRef.current?.pointerId === e.pointerId) endHold();
    };

    // Backgrounding the tab must not let the run continue (or die) unseen.
    const visibilityHandler = () => {
      if (document.visibilityState !== 'hidden') return;
      endHold();
      const state = useGameStore.getState();
      if (isPlaying(state.gameState) && !state.isPaused) state.pauseGame();
    };

    window.addEventListener('pointerdown', pointerDownHandler);
    window.addEventListener('pointermove', pointerMoveHandler);
    window.addEventListener('pointerup', pointerUpHandler);
    window.addEventListener('pointercancel', pointerUpHandler);
    document.addEventListener('visibilitychange', visibilityHandler);
    return () => {
      window.removeEventListener('pointerdown', pointerDownHandler);
      window.removeEventListener('pointermove', pointerMoveHandler);
      window.removeEventListener('pointerup', pointerUpHandler);
      window.removeEventListener('pointercancel', pointerUpHandler);
      document.removeEventListener('visibilitychange', visibilityHandler);
      if (tapSteerTimerRef.current) clearTimeout(tapSteerTimerRef.current);
      endHold();
    };
  }, []);

  useGameLoop(joystickXRef);

  return null;
}
