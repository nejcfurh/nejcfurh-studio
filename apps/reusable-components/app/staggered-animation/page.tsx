'use client';

import BackButton from '@/components/buttons/BackButton';
import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import ItemsList from './components/ItemsList';

const StaggeredAnimationPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br flex justify-center items-center from-gray-950 via-black to-gray-900">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl animate-pulse dark:bg-blue-500/10" />
      <BackButton className="top-5 left-5" />
      <div className="w-full h-full flex-col flex gap-4 items-center py-20">
        <h1 className="text-5xl font-bold text-white mb-32">
          Staggered List Animation
        </h1>
        <ItemsList
          className="flex flex-wrap gap-2 items-center text-lg text-white justify-center max-w-3xl"
          classNameItems="border-white/50 border rounded-2xl px-4 py-2 items-center flex gap-2 min-w-32 justify-center"
        />
      </div>
    </div>
  );
};

export default StaggeredAnimationPage;
