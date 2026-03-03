'use client';

import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import BackButton from '@/components/buttons/BackButton';

import ItemsList from './components/ItemsList';

const StaggeredAnimationPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-950 via-black to-gray-900">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <BackButton className="top-5 left-5" />
      <div className="flex h-full w-full flex-col items-center gap-4 py-20">
        <h1 className="mb-32 text-5xl font-bold text-white">
          Staggered List Animation
        </h1>
        <ItemsList
          className="flex max-w-3xl flex-wrap items-center justify-center gap-2 text-lg text-white"
          classNameItems="border-white/50 border rounded-2xl px-4 py-2 items-center flex gap-2 min-w-32 justify-center"
        />
      </div>
    </div>
  );
};

export default StaggeredAnimationPage;
