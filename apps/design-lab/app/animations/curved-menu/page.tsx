'use client';

import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import AnimationTitle from '@/components/AnimationTitle';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';
import CurvedMenu from '@/features/curved-menu/components/CurvedMenu';

const CurvedMenuPage = () => {
  return (
    <Background>
      <BackButton className="top-5 left-5" />
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <AnimationTitle
        title="Curved Menu"
        subtitle="This is a simple curved menu that is modeled after the Awwards winning menu."
      />
      <CurvedMenu />
    </Background>
  );
};

export default CurvedMenuPage;
