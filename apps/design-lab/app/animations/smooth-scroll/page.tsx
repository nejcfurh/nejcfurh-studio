import BackButton from '@/components/buttons/BackButton';
import Hero from '@/features/smooth-scroll/components/Hero';
import NavBar from '@/features/smooth-scroll/components/NavBar';
import Schedule from '@/features/smooth-scroll/components/Schedule';
import SmoothScrollFooter from '@/features/smooth-scroll/components/SmoothScrollFooter';
import ZoomParallaxGallery from '@/features/smooth-scroll/components/ZoomParallaxGallery';
import { ReactLenis } from 'lenis/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SpaceX Showcase | Design Lab',
  description: 'SpaceX Showcase with Smooth Scroll and ClipPath'
};

const SmoothScrollPage = () => {
  return (
    <div className="min-h-screen bg-zinc-950">
      <BackButton className="fixed top-20 left-5 opacity-50" />
      <ReactLenis root options={{ lerp: 0.05 }}>
        <NavBar />
        <Hero />
        <Schedule />
        <ZoomParallaxGallery />
        <SmoothScrollFooter />
      </ReactLenis>
    </div>
  );
};

export default SmoothScrollPage;
