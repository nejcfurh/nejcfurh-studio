import BackButton from '@/components/buttons/BackButton';
import { ReactLenis } from 'lenis/react';

import Footer from './components/Footer';
import Hero from './components/Hero';
import NavBar from './components/NavBar';
import Schedule from './components/Schedule';
import ZoomParallaxGallery from './components/ZoomParallaxGallery';

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
