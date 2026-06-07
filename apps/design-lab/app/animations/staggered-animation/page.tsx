'use client';

import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import AnimationTitle from '@/components/AnimationTitle';
import BackButton from '@/components/buttons/BackButton';
import ItemsList from '@/features/staggered-animation/components/ItemsList';

const StaggeredAnimationPage = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center bg-linear-to-br from-gray-950 via-black to-gray-900">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <BackButton className="top-5 left-5" />
      <AnimationTitle
        title="Staggered List Animation"
        subtitle="Each item animates into place, one after another."
      />
      <div className="flex w-full flex-1 items-center justify-center px-4 pb-16">
        <ItemsList
          className="flex max-w-3xl flex-wrap items-center justify-center gap-2 text-lg text-white"
          classNameItems="border-white/50 border rounded-2xl px-4 py-2 items-center flex gap-2 min-w-32 justify-center"
        />
      </div>
    </div>
  );
};

export default StaggeredAnimationPage;
