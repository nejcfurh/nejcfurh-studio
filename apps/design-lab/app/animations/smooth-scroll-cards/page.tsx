'use client';

import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import AnimationTitle from '@/components/AnimationTitle';
import BackButton from '@/components/buttons/BackButton';
import Card from '@/features/smooth-scroll-cards/components/Card';
import { CARD_DATA } from '@/features/smooth-scroll-cards/constants';
import { useScroll } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';
import ReactLenis from '@repo/ui/animation/lenis';
import { useRef } from 'react';

const SmoothScrollCardsPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <ReactLenis root options={{ lerp: 0.05 }}>
      <div className="relative min-h-screen bg-linear-to-br from-gray-950 via-black to-gray-900">
        <AnimatedBackgroundGradient />
        <FloatingOrb className="fixed top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
        <BackButton className="fixed top-5 left-5" />
        <AnimationTitle
          title="Smooth Scroll Cards"
          subtitle="Scroll down to watch the cards stack and scale into place."
          className="fixed"
        />
        <AnimatedDiv
          ref={containerRef}
          className="relative w-full pt-[60vh] pb-0 sm:pb-[5vh]"
        >
          {CARD_DATA.map((card, index) => {
            const targetScale = 1 - (CARD_DATA.length - index) * 0.05;

            return (
              <Card
                key={card.description}
                {...card}
                index={index}
                range={[index * (1 / CARD_DATA.length), 1]}
                targetScale={targetScale}
                progress={scrollYProgress}
              />
            );
          })}
        </AnimatedDiv>
      </div>
    </ReactLenis>
  );
};

export default SmoothScrollCardsPage;
