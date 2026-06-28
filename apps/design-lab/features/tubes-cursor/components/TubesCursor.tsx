'use client';

import { useEffect, useRef } from 'react';
import type { TubesCursorApp } from 'threejs-components/build/cursors/tubes1.min.js';

import {
  MOBILE_MEDIA_QUERY,
  randomColors,
  SLEEP_RADIUS_DESKTOP,
  SLEEP_RADIUS_MOBILE,
  TUBE_COLORS,
  TUBE_LIGHT_COLORS,
  TUBE_LIGHT_INTENSITY
} from '../constants';

const sleepRadiusFor = (isMobile: boolean) =>
  isMobile ? SLEEP_RADIUS_MOBILE : SLEEP_RADIUS_DESKTOP;

/**
 * WEBGL TUBES CURSOR EFFECT. THE UNDERLYING `THREEJS-COMPONENTS` LIBRARY
 * BUNDLES ITS OWN COPY OF THREE.JS AND ONLY RUNS IN THE BROWSER, SO IT IS
 * IMPORTED DYNAMICALLY INSIDE THE EFFECT TO KEEP IT OUT OF THE SERVER BUNDLE.
 *
 * CLICKING THE CANVAS RANDOMISES THE TUBE AND LIGHT COLORS — THE LISTENER IS
 * BOUND TO THE CANVAS ELEMENT (NOT `DOCUMENT`) SO IT STAYS SELF-CONTAINED.
 */
const TubesCursor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let app: TubesCursorApp | null = null;
    let disposed = false;

    const onClick = () => {
      app?.tubes.setColors(randomColors(3));
      app?.tubes.setLightsColors(randomColors(4));
    };

    // When idle the tubes drift along a Lissajous curve. Flip its orientation
    // so it drifts vertically on phones (no cursor) and horizontally on desktop.
    const mql = window.matchMedia(MOBILE_MEDIA_QUERY);
    const onOrientationChange = (event: MediaQueryListEvent) => {
      if (!app) return;
      const radius = sleepRadiusFor(event.matches);
      app.options.sleepRadiusX = radius.x;
      app.options.sleepRadiusY = radius.y;
    };

    import('threejs-components/build/cursors/tubes1.min.js')
      .then(({ default: createTubesCursor }) => {
        // The component may have unmounted while the chunk was loading.
        if (disposed) return;

        const radius = sleepRadiusFor(mql.matches);
        app = createTubesCursor(canvas, {
          tubes: {
            colors: TUBE_COLORS,
            lights: {
              intensity: TUBE_LIGHT_INTENSITY,
              colors: TUBE_LIGHT_COLORS
            }
          },
          sleepRadiusX: radius.x,
          sleepRadiusY: radius.y
        });

        canvas.addEventListener('click', onClick);
        mql.addEventListener('change', onOrientationChange);
      })
      .catch((error) => {
        console.error('Failed to initialise tubes cursor', error);
      });

    return () => {
      disposed = true;
      canvas.removeEventListener('click', onClick);
      mql.removeEventListener('change', onOrientationChange);
      app?.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* `touch-none` lets a finger drag steer the tubes instead of the browser
          treating it as a scroll/pinch gesture (there is no cursor on mobile). */}
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none select-none"
      />
    </div>
  );
};

export default TubesCursor;
