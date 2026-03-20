import BackButton from '@/components/buttons/BackButton';
import Footer from '@/features/smooth-scroll/components/Footer';
import Hero from '@/features/smooth-scroll/components/Hero';
import NavBar from '@/features/smooth-scroll/components/NavBar';
import Schedule from '@/features/smooth-scroll/components/Schedule';
import ZoomParallaxGallery from '@/features/smooth-scroll/components/ZoomParallaxGallery';
import { ReactLenis } from 'lenis/react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DesignLab | SpaceX Showcase',
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
        <Footer />
      </ReactLenis>
    </div>
  );
};

export default SmoothScrollPage;
