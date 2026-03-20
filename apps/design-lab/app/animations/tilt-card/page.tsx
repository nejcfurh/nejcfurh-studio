import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import BackButton from '@/components/buttons/BackButton';

import SVGFilters from './components/SVGFilters';
import HolographicCard from './components/TiltCard';

export default function TiltCardPage() {
  return (
    <div className="flex min-h-screen items-center justify-evenly bg-linear-to-br from-gray-950 via-black to-gray-900">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <BackButton className="top-5 left-5" />
      <SVGFilters />

      <div className="w-full max-w-7xl">
        {/* INSTRUCTIONS */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold text-white">
            Holographic 3D Card
          </h1>
          <p className="text-xl text-gray-400">
            Hover across the card to see the holographic effect • Click to flip
          </p>
        </div>
        <div className="flex items-center justify-center">
          <HolographicCard
            name="Nejc Furh"
            title="Product Engineer"
            imageUrl="/images/tilt-card/portrait.png"
            logo="/images/tilt-card/bb-logo-vertical.svg"
          />
        </div>
      </div>
    </div>
  );
}
