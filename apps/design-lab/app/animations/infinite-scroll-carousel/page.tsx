'use client';

import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import AnimationTitle from '@/components/AnimationTitle';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';
import InfiniteCarousel from '@/features/infinite-scroll-carousel/components/InfiniteCarousel';

const InfiniteScrollCarouselPage = () => {
  return (
    <Background>
      <BackButton className="top-5 left-5" />
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <AnimationTitle
        title="Infinite Scroll Carousel"
        subtitle="This is a simple infinite scroll carousel that is modeled after the Apple Music carousel used in the Apple Homepod product page."
      />
      <InfiniteCarousel />
    </Background>
  );
};

export default InfiniteScrollCarouselPage;
