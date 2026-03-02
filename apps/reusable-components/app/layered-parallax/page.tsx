import BackButton from '@/components/buttons/BackButton';
import MultiLayerParallax from './components/MultiLayerParallax';
import AnimatedText from '@/components/animation-core/AnimatedText';
import {
  LAYERED_PARALLAX_TEXT_1,
  LAYERED_PARALLAX_TEXT_2,
} from '@/features/layered-parallax/constants';
import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import ReactLenis from 'lenis/react';

export default function Home() {
  return (
    <div className="bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 relative">
      <BackButton className="fixed top-5 left-5 z-50" />
      <ReactLenis root options={{ lerp: 0.05 }}>
        <MultiLayerParallax />
        <div className="w-[50%] h-screen flex flex-col items-center justify-center text-justify gap-5 text-2xl text-gray-700 dark:text-gray-300 mx-auto">
          <AnimatedBackgroundGradient />
          <FloatingOrb className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl animate-pulse dark:bg-blue-500/10" />
          <FloatingOrb className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl animate-pulse animation-delay-2000 dark:bg-indigo-500/10" />
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
