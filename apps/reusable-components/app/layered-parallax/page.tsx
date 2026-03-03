import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import AnimatedText from '@/components/animation-core/AnimatedText';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import BackButton from '@/components/buttons/BackButton';
import {
  LAYERED_PARALLAX_TEXT_1,
  LAYERED_PARALLAX_TEXT_2
} from '@/features/layered-parallax/constants';
import ReactLenis from 'lenis/react';

import MultiLayerParallax from './components/MultiLayerParallax';

export default function Home() {
  return (
    <div className="relative bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">
      <BackButton className="fixed top-5 left-5 z-50" />
      <ReactLenis root options={{ lerp: 0.05 }}>
        <MultiLayerParallax />
        <div className="mx-auto flex h-screen w-[50%] flex-col items-center justify-center gap-5 text-justify text-2xl text-gray-700 dark:text-gray-300">
          <AnimatedBackgroundGradient />
          <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
          <FloatingOrb className="animation-delay-2000 absolute right-10 bottom-20 h-96 w-96 animate-pulse rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10" />
          <AnimatedText className="font-light">
            {LAYERED_PARALLAX_TEXT_1}
          </AnimatedText>
          <AnimatedText className="font-light">
            {LAYERED_PARALLAX_TEXT_2}
          </AnimatedText>
        </div>
      </ReactLenis>
    </div>
  );
}
