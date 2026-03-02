import Tooltip from '@/components/Tooltip';
import ScrollToUnblur from './components/ScrollToUnblur';
import BackButton from '@/components/buttons/BackButton';
import Background from '@/components/Background';
import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';

export default function Home() {
  return (
    <Background className="flex items-center justify-center">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl animate-pulse dark:bg-blue-500/10" />
      <BackButton className="top-5 left-5" />
      <ScrollToUnblur />
      <Tooltip
        text="Scroll down to unblur"
        bgColor="bg-amber-50/80 backdrop-blur-2xl"
        textColor="text-black"
        className="bottom-5 left-1/2 -translate-x-1/2"
      />
    </Background>
  );
}
