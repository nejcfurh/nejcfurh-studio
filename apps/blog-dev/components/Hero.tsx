'use client';

import type { IPost } from '@/lib/models/post';
import { easeOut } from '@/utils/motion';
import { useReducedMotion } from '@repo/ui/animation';
import {
  AnimatedDiv,
  AnimatedSpan,
  AnimatedTitle
} from '@repo/ui/animation/core';
import { JSX } from 'react';

import PostCarousel from './PostCarousel';

const word = 'BLOG';

interface HeroProps {
  posts: IPost[];
  isAdmin?: boolean;
}

const Hero = ({ posts, isAdmin }: HeroProps): JSX.Element => {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[80vh] w-full flex-col justify-center overflow-x-clip py-16 sm:pt-0 sm:pb-28">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 px-6 sm:px-8 lg:flex-row lg:gap-10 lg:px-12">
        {/* FEATURED — AUTOMATIC, INFINITE CAROUSEL OF POSTS (LEFT).
            ENTERS AFTER THE BLOG TITLE HAS ANIMATED IN. */}
        {posts.length > 0 && (
          <AnimatedDiv
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: reduce ? 0 : 1.2,
              ease: easeOut
            }}
            className="w-full min-w-0 lg:flex-1"
          >
            <PostCarousel posts={posts} isAdmin={isAdmin} />
          </AnimatedDiv>
        )}

        {/* TITLE — RIGHT ALIGNED, NO SUBTITLE (RIGHT) */}
        <div className="flex shrink-0 flex-col items-center text-center lg:w-auto lg:items-end lg:text-right">
          {/* LABEL */}
          <AnimatedDiv
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
            className="mb-8"
          >
            <span className="text-secondary font-mono text-sm tracking-[0.2em] uppercase">
              Writing &amp; Notes
            </span>
          </AnimatedDiv>

          {/* GIANT WORD */}
          <div className="overflow-hidden">
            <AnimatedTitle
              className="text-gradient-accent text-[clamp(56px,9vw,128px)] leading-[0.9] font-bold tracking-tighter"
              aria-label="Blog"
            >
              {word.split('').map((char, i) => (
                <AnimatedSpan
                  key={`char-${i}`}
                  initial={reduce ? false : { y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4 + i * 0.05,
                    ease: easeOut
                  }}
                  className="inline-block"
                >
                  {char}
                </AnimatedSpan>
              ))}
            </AnimatedTitle>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
