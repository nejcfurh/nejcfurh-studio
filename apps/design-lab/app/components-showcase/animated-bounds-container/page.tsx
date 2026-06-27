import AnimationTitle from '@/components/AnimationTitle';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';
import CycleLabelButton from '@/features/animated-bounds-container/components/CycleLabelButton';
import ReadMoreCard from '@/features/animated-bounds-container/components/ReadMoreCard';
import { AnimatedDiv } from '@repo/ui/animation/core';

// FADE/BLUR UP ENTRANCE. THE CARD COMES IN AFTER THE TITLE, THE BUTTON 0.5S LATER.
const fadeUp = {
  initial: { opacity: 0, y: 16, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' }
};

const ease = [0.19, 1, 0.22, 1] as const;
const CARD_DELAY = 0.4;
const BUTTON_DELAY = CARD_DELAY + 0.5;

const AnimatedBoundsContainerPage = () => {
  return (
    <Background className="flex flex-col items-center justify-center gap-10 px-4 py-24">
      <BackButton className="top-5 left-5 z-50" />
      <AnimationTitle
        title="Animated Bounds Container"
        subtitle="Measure a container's bounds and animate to them so size changes feel smooth and intentional."
      />
      <AnimatedDiv
        {...fadeUp}
        transition={{ duration: 0.6, ease, delay: CARD_DELAY }}
        className="w-full max-w-[400px]"
      >
        <ReadMoreCard />
      </AnimatedDiv>
      <AnimatedDiv
        {...fadeUp}
        transition={{ duration: 0.6, ease, delay: BUTTON_DELAY }}
      >
        <CycleLabelButton />
      </AnimatedDiv>
    </Background>
  );
};

export default AnimatedBoundsContainerPage;
