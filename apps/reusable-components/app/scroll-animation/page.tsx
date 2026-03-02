'use client';

import BackButton from '@/components/buttons/BackButton';
import ParallaxSection from './components/ParallaxSection';
import MultiColumnScroll from './components/MultiColumnScroll';
import { ReactLenis } from 'lenis/react';
import StickyFooter from './components/StickyFooter';

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
