'use client';

import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import AnimationTitle from '@/components/AnimationTitle';
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

      <AnimationTitle
        title="Ripple Shader"
        subtitle="Move your cursor across the images"
      />
    </Background>
  );
};

export default RippleShaderPage;
