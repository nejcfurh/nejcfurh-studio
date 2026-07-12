'use client';

import BackButton from '@/components/buttons/BackButton';
import DescriptionSection from '@/features/perspective-transition/components/DescriptionSection';
import ImageSection from '@/features/perspective-transition/components/ImageSection';
import PerspectivePanel from '@/features/perspective-transition/components/PerspectivePanel';
import {
  PERSPECTIVE_SLIDES,
  PerspectiveSlide
} from '@/features/perspective-transition/constants';
import { useScroll } from '@repo/ui/animation';
import ReactLenis from '@repo/ui/animation/lenis';
import { useRef } from 'react';

// height of each panel, in viewport screens — bigger = pinned (sticky) longer.
// images get more so they linger before the next panel folds over.
const SCREENS = { description: 1.4, image: 2.4 };

type Panel = {
  key: string;
  slide: PerspectiveSlide;
  kind: 'description' | 'image';
  height: number; // vh
  // scroll-progress ranges where this panel scales in / folds away (null at the ends)
  enter: [number, number] | null;
  leave: [number, number] | null;
};

// The layout is fully derived from the (static) slides, so build it once:
// each slide -> a description panel then its image panel, laid out by height,
// with each panel's enter/leave windows derived from its top offset. The fold
// transition is always a one-viewport slide; a panel's extra height is dwell.
const PANELS: Panel[] = (() => {
  const specs = PERSPECTIVE_SLIDES.flatMap((slide) => [
    {
      key: `${slide.image}-desc`,
      slide,
      kind: 'description' as const,
      height: SCREENS.description * 100
    },
    {
      key: `${slide.image}-img`,
      slide,
      kind: 'image' as const,
      height: SCREENS.image * 100
    }
  ]);

  const denom = specs.reduce((sum, p) => sum + p.height, 0) - 100;

  let top = 0;
  return specs.map((spec, i) => {
    const next = top + spec.height;
    const enter: [number, number] | null =
      i === 0 ? null : [(top - 100) / denom, top / denom];
    const leave: [number, number] | null =
      i === specs.length - 1 ? null : [(next - 100) / denom, next / denom];
    top = next;
    return { ...spec, enter, leave };
  });
})();

const PerspectiveTransitionPage = () => {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <ReactLenis root options={{ lerp: 0.05 }}>
      <BackButton className="fixed top-5 left-5 z-50" />
      <main ref={container} className="relative bg-neutral-900">
        {PANELS.map((panel) => (
          // tall wrapper supplies the scroll distance; the sticky panel inside
          // stays pinned full-screen across it, so the next panel only arrives
          // once you've scrolled past this height.
          <div key={panel.key} style={{ height: `${panel.height}vh` }}>
            <PerspectivePanel
              enter={panel.enter}
              leave={panel.leave}
              progress={scrollYProgress}
            >
              {panel.kind === 'description' ? (
                <DescriptionSection
                  title={panel.slide.title}
                  description={panel.slide.description}
                  color={panel.slide.color}
                />
              ) : (
                <ImageSection
                  image={panel.slide.image}
                  alt={panel.slide.title}
                />
              )}
            </PerspectivePanel>
          </div>
        ))}
      </main>
    </ReactLenis>
  );
};

export default PerspectiveTransitionPage;
