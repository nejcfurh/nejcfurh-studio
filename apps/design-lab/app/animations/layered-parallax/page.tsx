import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import BackButton from '@/components/buttons/BackButton';
import MultiLayerParallax from '@/features/layered-parallax/components/MultiLayerParallax';
import {
  LAYERED_PARALLAX_TEXT_1,
  LAYERED_PARALLAX_TEXT_2
} from '@/features/layered-parallax/constants';
import { AnimatedText } from '@repo/ui/animation/core';
import ReactLenis from '@repo/ui/animation/lenis';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Layered Parallax | Design Lab',
  description: 'Layered parallax component'
};

export default function Home() {
  return (
    <div className="relative bg-linear-to-br from-gray-950 via-slate-900 to-gray-900">
      <BackButton className="fixed top-5 left-5 z-50" />
      <ReactLenis root options={{ lerp: 0.05 }}>
        <MultiLayerParallax />
        <div className="mx-auto flex h-screen w-[85%] flex-col items-center justify-center gap-5 px-2 text-justify text-base text-gray-300 sm:w-[50%] sm:px-0 sm:text-2xl">
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
