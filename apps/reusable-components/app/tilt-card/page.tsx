import HolographicCard from './components/TiltCard';
import SVGFilters from './components/SVGFilters';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import BackButton from '@/components/buttons/BackButton';

export default function TiltCardPage() {
  return (
    <div className="min-h-screen bg-linear-to-br flex justify-evenly items-center from-gray-950 via-black to-gray-900">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl animate-pulse dark:bg-blue-500/10" />
      <BackButton className="top-5 left-5" />
      <SVGFilters />

      <div className="max-w-7xl w-full">
        {/* INSTRUCTIONS */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
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
