'use client';

import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform
} from '@repo/ui/animation';
import { AnimatedDiv, AnimatedTitle } from '@repo/ui/animation/core';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';

import { PROJECT_CLIP_HIDDEN, PROJECT_CLIP_VISIBLE } from '../constants';
import { InfiniteScrollTransitionData } from '../types';

const POWER2_OUT = [0.33, 1, 0.68, 1] as const;

type NextProjectProps = {
  nextProject: InfiniteScrollTransitionData;
};

const NextProject = ({ nextProject }: NextProjectProps) => {
  const nextProjectRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const isNavigatingRef = useRef(false);
  const isArmedRef = useRef(false);
  const router = useRouter();

  const titleOpacity = useMotionValue(1);
  const progressContainerScaleX = useMotionValue(1);
  const imageClipPath = useMotionValue(PROJECT_CLIP_VISIBLE);

  const { scrollYProgress: parallaxProgress } = useScroll({
    target: stickyRef,
    offset: ['start end', 'end end']
  });
  const smoothParallax = useSpring(parallaxProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const y = useTransform(smoothParallax, [0, 1], [-200, 0]);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: nextProjectRef,
    offset: ['start start', 'end end']
  });
  const smoothSection = useSpring(sectionProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const scale = useTransform(smoothSection, [0, 1], [1.2, 1]);
  const progressWidth = useTransform(smoothSection, [0, 1], ['0%', '100%']);

  const runExitAnimation = useCallback(async () => {
    // exitTl: .title opacity→0 and .progressContainer scaleX→0 in parallel
    // (both 0.3s at position 0), then .nextProjectImage clip (0.5s).
    await Promise.all([
      animate(titleOpacity, 0, { duration: 0.3, ease: POWER2_OUT }),
      animate(progressContainerScaleX, 0, { duration: 0.3, ease: POWER2_OUT })
    ]);
    await animate(imageClipPath, PROJECT_CLIP_HIDDEN, {
      duration: 0.5,
      ease: POWER2_OUT
    });
    router.push(`/animations/infinite-scroll-transition/${nextProject.slug}`);
  }, [
    imageClipPath,
    nextProject.slug,
    progressContainerScaleX,
    router,
    titleOpacity
  ]);

  useMotionValueEvent(sectionProgress, 'change', (latest) => {
    if (latest < 0.1) {
      isArmedRef.current = true;
    }

    if (latest >= 1 && isArmedRef.current && !isNavigatingRef.current) {
      isNavigatingRef.current = true;
      void runExitAnimation();
    }
  });

  if (!nextProject) return null;

  return (
    <section ref={nextProjectRef} className="relative h-[200vh]">
      <div ref={stickyRef} className="sticky inset-0 h-svh overflow-hidden">
        <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <AnimatedTitle
            className="title mb-4 text-center text-2xl font-medium uppercase"
            style={{ opacity: titleOpacity }}
          >
            {nextProject.title}
          </AnimatedTitle>
          <AnimatedDiv
            className="progressContainer relative mx-auto h-px w-[220px] origin-right bg-[#7e7b7b]"
            style={{ scaleX: progressContainerScaleX }}
          >
            <AnimatedDiv
              className="progress absolute top-0 left-0 h-px bg-white"
              style={{ width: progressWidth }}
            />
          </AnimatedDiv>
        </div>

        <div className="absolute inset-0 h-svh overflow-hidden">
          <AnimatedDiv
            className="nextProjectImageContainer relative h-full will-change-transform"
            style={{ y }}
          >
            {/* clipPath on an unscaled wrapper (matching the Hero) so the fixed
                inset is measured against the full-viewport box, not the scaled
                image. Scale lives on the inner element. */}
            <AnimatedDiv
              className="nextProjectImage relative h-full w-full"
              style={{ clipPath: imageClipPath }}
            >
              <AnimatedDiv
                className="relative h-full w-full will-change-transform"
                style={{ scale }}
              >
                <Image
                  src={nextProject.image}
                  alt={nextProject.title}
                  fill
                  preload
                  unoptimized
                  decoding="sync"
                  className="object-cover object-bottom opacity-50"
                />
              </AnimatedDiv>
            </AnimatedDiv>
          </AnimatedDiv>
        </div>
      </div>
    </section>
  );
};

export default NextProject;
