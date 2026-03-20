import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';

import { ScrollToDecryptWithSuspense } from './components/ScrollToDecrypt';

export default function Home() {
  return (
    <Background className="flex items-center justify-center">
      <BackButton className="fixed top-5 left-5" />
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <ScrollToDecryptWithSuspense
        title="NaturalEarth.ai"
        subtitle="A smarter way to reconnect with the natural world."
        trackLength={35}
        startOffset={-1.7}
        endOffset={-0.5}
        enableScrollContent={true}
      />
    </Background>
  );
}
