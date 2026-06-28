'use client';

import type { IPost } from '@/lib/models/post';
import { easeOut } from '@/utils/motion';
import { useReducedMotion, type PanInfo } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { JSX, useCallback, useEffect, useRef, useState } from 'react';

import PostCard from './PostCard';

interface PostCarouselProps {
  posts: IPost[];
  isAdmin?: boolean;
}

// HOW MANY CARDS ARE VISIBLE ON EACH SIDE OF THE CENTERED ONE.
const SIDE = 1;
// HORIZONTAL SPACING BETWEEN NEIGHBOURING CARDS (PX). KEPT TIGHT SO SIDE
// CARDS STAY FULLY INSIDE THE STAGE (NO HARD-CLIPPED EDGES).
const SPACING = 180;
// BASE SCALE OF THE CENTERED CARD — SHRINKS THE WHOLE ITEM (~70%).
const BASE_SCALE = 0.72;
const AUTO_ADVANCE_MS = 5000;
const SWIPE_THRESHOLD = 60;

/**
 * RETURNS THE SHORTEST SIGNED DISTANCE FROM `INDEX` TO `CENTER` ON A RING OF
 * `LENGTH` ITEMS, E.G. FOR LENGTH 5, CENTER 0: INDEX 4 -> -1 (IT WRAPS).
 */
const circularOffset = (
  index: number,
  center: number,
  length: number
): number => {
  let diff = index - center;
  const half = length / 2;
  if (diff > half) diff -= length;
  if (diff < -half) diff += length;
  return diff;
};

const PostCarousel = ({ posts, isAdmin }: PostCarouselProps): JSX.Element => {
  const reduce = useReducedMotion();
  const [center, setCenter] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  // RESPONSIVE LAYOUT: ON NARROW SCREENS SHOW ONLY THE FOCUSED CARD (NO SIDE PEAKS → NO CLIPPING), AND SCALE THE SPACING TO THE AVAILABLE WIDTH.
  const [layout, setLayout] = useState({ spacing: SPACING, side: SIDE });
  const length = posts.length;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      // ALWAYS KEEP THE SIDE CARDS VISIBLE; JUST TUCK THEM CLOSER ON NARROW SCREENS SO THEY PEEK BESIDE THE FOCUSED CARD.
      setLayout({
        side: SIDE,
        spacing: Math.min(SPACING, Math.round(w * 0.34))
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const step = useCallback(
    (dir: number) => {
      setCenter((prev) => (prev + dir + length) % length);
    },
    [length]
  );

  // AUTO-ADVANCE — DISABLED FOR REDUCED MOTION, WHEN PAUSED, OR WITH ONE POST.
  useEffect(() => {
    if (reduce || paused || length <= 1) return;
    const id = window.setInterval(() => step(1), AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduce, paused, length, step]);

  const handleDragEnd = (_e: unknown, info: PanInfo): void => {
    if (info.offset.x <= -SWIPE_THRESHOLD) step(1);
    else if (info.offset.x >= SWIPE_THRESHOLD) step(-1);
  };

  // SINGLE POST: RENDER IT PLAINLY, NO CAROUSEL CHROME.
  if (length === 1) {
    return (
      <div className="mx-auto max-w-sm">
        <PostCard post={posts[0]!} isAdmin={isAdmin} active />
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* STAGE */}
      <div
        ref={stageRef}
        className="relative flex h-[360px] items-center justify-center perspective-distant"
        role="group"
        aria-roledescription="carousel"
        aria-label="Blog posts"
      >
        {posts.map((post, i) => {
          const offset = circularOffset(i, center, length);
          const distance = Math.abs(offset);

          // Cull cards outside the visible window.
          if (distance > layout.side) return null;

          const isCenter = offset === 0;
          const x = offset * layout.spacing;
          // Shrink the whole item (natural card proportions, not fixed w/h);
          // neighbours recede a touch further.
          const scale = reduce
            ? BASE_SCALE
            : BASE_SCALE * Math.max(0.82, 1 - distance * 0.12);
          // Side cards fade off much more sharply than the centered one.
          const opacity = isCenter
            ? 1
            : Math.max(0.04, 0.34 - (distance - 1) * 0.22);
          const rotateY = reduce ? 0 : offset * -22;

          return (
            <AnimatedDiv
              key={post._id as string}
              className="absolute inset-0 flex items-center justify-center"
              style={{ zIndex: 100 - distance, willChange: 'transform' }}
              initial={false}
              animate={{ x, scale, opacity, rotateY }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.65, ease: easeOut }
              }
              drag={isCenter ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={isCenter ? handleDragEnd : undefined}
            >
              <div
                className={`w-[340px] max-w-[80vw] ${
                  isCenter
                    ? 'rounded-3xl bg-(--surface) shadow-[0_24px_70px_-24px_rgba(0,0,0,0.75)]'
                    : ''
                }`}
              >
                {isCenter ? (
                  <PostCard post={post} isAdmin={isAdmin} active />
                ) : (
                  // Unfocused cards are inert — no click/touch/drag at all.
                  <div className="pointer-events-none select-none" aria-hidden>
                    <PostCard post={post} isAdmin={isAdmin} active={false} />
                  </div>
                )}
              </div>
            </AnimatedDiv>
          );
        })}
      </div>
    </div>
  );
};

export default PostCarousel;
