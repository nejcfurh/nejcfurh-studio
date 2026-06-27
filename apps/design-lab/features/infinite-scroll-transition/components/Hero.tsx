'use client';

import { useScroll, useSpring, useTransform } from '@repo/ui/animation';
import { AnimatedDiv, AnimatedSpan } from '@repo/ui/animation/core';
import Image from 'next/image';
import { useRef } from 'react';
import { FiArrowDown } from 'react-icons/fi';

import {
  POWER3_OUT_ANIMATION,
  PROJECT_CLIP_HIDDEN,
  PROJECT_CLIP_VISIBLE
} from '../constants';
import { InfiniteScrollTransitionData } from '../types';
import {
  MaskRevealH1,
  MaskRevealP,
  MaskRevealSpan
} from './MaskRevealComponents';

type HeroProps = {
  project: InfiniteScrollTransitionData;
};

const Hero = ({ project }: HeroProps) => {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scale = useTransform(smoothProgress, [0, 1], [1, 1.12]);

  return (
    <section ref={heroRef} className="relative h-svh overflow-hidden">
      <AnimatedDiv
        className="absolute inset-0"
        initial={{ clipPath: PROJECT_CLIP_HIDDEN }}
        animate={{ clipPath: PROJECT_CLIP_VISIBLE }}
        transition={{ duration: 0.7, ease: POWER3_OUT_ANIMATION }}
      >
        <AnimatedDiv
          className="absolute inset-0 will-change-transform"
          style={{ scale }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            preload
            unoptimized
            decoding="sync"
            className="heroImage object-cover object-bottom opacity-50"
          />
        </AnimatedDiv>
      </AnimatedDiv>

      <div className="absolute inset-x-0 bottom-0 font-medium">
        <div className="bg-black px-7.5 pb-9 md:min-h-[200px] md:pb-8.5">
          <div className="flex items-center justify-between gap-4 border-b border-white/15 pt-3 pb-3 text-xs tracking-wider text-zinc-400 uppercase md:mb-2">
            <MaskRevealSpan delay={0.1}>Selected Work</MaskRevealSpan>
            <MaskRevealSpan className="text-right" delay={0.15}>
              Inspired by Awwwards Page of the Day{' '}
              <span className="hidden md:inline-block">
                - Images by Unsplash.
              </span>
            </MaskRevealSpan>
          </div>

          <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
            <MaskRevealH1 className="max-w-4xl py-1 text-4xl tracking-tight text-white lg:text-6xl">
              {project.title}
            </MaskRevealH1>
            {project.description && (
              <MaskRevealP
                className="max-w-96 text-sm text-zinc-400 lg:text-xl lg:font-normal"
                delay={0.2}
              >
                {project.description}
              </MaskRevealP>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 text-xs tracking-wider text-zinc-400 uppercase">
            <MaskRevealSpan delay={0.3}>Scroll to see more</MaskRevealSpan>
            <AnimatedSpan
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 4, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 0.3 },
                y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              <FiArrowDown />
            </AnimatedSpan>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
