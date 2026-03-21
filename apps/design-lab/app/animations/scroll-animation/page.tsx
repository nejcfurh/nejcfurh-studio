'use client';

import BackButton from '@/components/buttons/BackButton';
import MultiColumnScroll from '@/features/scroll-animation/components/MultiColumnScroll';
import ParallaxSection from '@/features/scroll-animation/components/ParallaxSection';
import StickyFooter from '@/features/scroll-animation/components/StickyFooter';
import { ReactLenis } from 'lenis/react';

const AppleScrollEffectPage = () => {
  return (
    <ReactLenis root options={{ lerp: 0.05 }}>
      <BackButton className="fixed top-5 left-5" />
      <div className="relative z-10 mb-[50vh]">
        {/* THIS IS A PRODUCT PAGE SCROLL ANIMATION BASED ON APPLE PRODUCT PAGE */}
        <ParallaxSection />
        {/* THIS IS MULTICOLUMN SCROLL ANIMATION EXAMPLE */}
        <MultiColumnScroll />
      </div>
      {/* STICKY FOOTER */}
      <StickyFooter />
    </ReactLenis>
  );
};

export default AppleScrollEffectPage;
