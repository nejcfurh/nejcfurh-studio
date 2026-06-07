import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import AnimationTitle from '@/components/AnimationTitle';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';
import ScrollToUnblur from '@/features/scroll-to-unblur/components/ScrollToUnblur';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Scroll to Unblur | Design Lab',
  description: 'Scroll to unblur component'
};

export default function Home() {
  return (
    <Background className="flex items-center justify-center">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <BackButton className="top-5 left-5" />
      <AnimationTitle
        title="Scroll to Unblur"
        subtitle="Scroll to bring the text gradually into focus."
      />
      <ScrollToUnblur />
    </Background>
  );
}
