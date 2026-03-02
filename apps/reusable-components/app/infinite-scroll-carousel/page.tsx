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
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl animate-pulse dark:bg-blue-500/10" />
      <h1 className="text-5xl w-full text-center font-bold text-white py-10 ">
        Infinite Scroll Carousel
      </h1>
      <p className="text-center text-xl py-12 text-white/50 mx-auto max-w-3xl">
        This is a simple infinite scroll carousel that is modeled after the
        Apple Music carousel used in the Apple Homepod product page.
      </p>
      <InfiniteCarousel />
    </Background>
  );
};

export default InfiniteScrollCarouselPage;
