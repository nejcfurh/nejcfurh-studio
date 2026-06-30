import { useEffect, useRef } from 'react';

interface UseInteractiveBubbleOptions {
  easing?: number;
}

/**
 * Smoothly trails an element toward the pointer by updating the
 * `--translate-x` / `--translate-y` CSS custom properties on each frame.
 *
 * Follows the mouse on desktop and the touch point on mobile (where there is
 * no cursor), so a tap or drag steers the bubble toward the finger.
 *
 * Uses refs + requestAnimationFrame (no React state) so the follow loop never
 * triggers a re-render.
 *
 * @returns a ref to attach to the element that should follow the pointer.
 */
const useInteractiveBubble = ({
  easing = 20
}: UseInteractiveBubbleOptions = {}) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const cur = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) target.current = { x: touch.clientX, y: touch.clientY };
    };

    let frameId = 0;

    const tick = () => {
      cur.current.x += (target.current.x - cur.current.x) / easing;
      cur.current.y += (target.current.y - cur.current.y) / easing;

      const { style } = bubbleRef.current ?? {};
      style?.setProperty('--translate-x', `${Math.round(cur.current.x)}px`);
      style?.setProperty('--translate-y', `${Math.round(cur.current.y)}px`);

      frameId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchMove);
    window.addEventListener('touchmove', handleTouchMove);
    frameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(frameId);
    };
  }, [easing]);

  return bubbleRef;
};

export default useInteractiveBubble;
