'use client';

import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';
import RippleShader from '@/features/ripple-shader/components/RippleShader';
import { RIPPLE_IMAGES } from '@/features/ripple-shader/constants';

const RippleShaderPage = () => {
  return (
    <Background className="h-screen overflow-hidden">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <BackButton className="top-5 left-5" />

      <div className="absolute inset-0">
        <RippleShader images={RIPPLE_IMAGES} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-5 flex flex-col items-center text-white">
        <h1 className="text-5xl font-semibold drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Ripple Shader
        </h1>
        <p className="mt-2 text-sm text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          Move your cursor across the images
        </p>
      </div>
    </Background>
  );
};

export default RippleShaderPage;
