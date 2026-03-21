'use client';

import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';

import InfiniteCarousel from './components/InfiniteCarousel';

const InfiniteScrollCarouselPage = () => {
  return (
    <Background>
      <BackButton className="top-5 left-5" />
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <h1 className="w-full py-10 text-center text-5xl font-bold text-white">
        Infinite Scroll Carousel
      </h1>
      <p className="mx-auto max-w-3xl py-12 text-center text-xl text-white/50">
        This is a simple infinite scroll carousel that is modeled after the
        Apple Music carousel used in the Apple Homepod product page.
      </p>
      <InfiniteCarousel />
    </Background>
  );
};

export default InfiniteScrollCarouselPage;
