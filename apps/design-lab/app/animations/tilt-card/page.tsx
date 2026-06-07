import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import AnimationTitle from '@/components/AnimationTitle';
import BackButton from '@/components/buttons/BackButton';
import LightingFilter from '@/features/tilt-card/components/LightingFilter';
import HolographicCard from '@/features/tilt-card/components/TiltCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Tilt Card | Design Lab',
  description: 'Interactive 3D tilt card that responds to mouse movement.'
};

export default function TiltCardPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-evenly bg-linear-to-br from-gray-950 via-black to-gray-900">
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <BackButton className="top-5 left-5" />
      <LightingFilter />
      <AnimationTitle
        title="Holographic 3D Card"
        subtitle="Hover across the card to see the holographic effect • Click to flip"
      />

      <div className="w-full max-w-7xl">
        <div className="mt-0 flex items-center justify-center sm:mt-16">
          <HolographicCard
            name="Nejc Furh"
            title="Product Engineer"
            imageUrl="/images/tilt-card/portrait.jpeg"
            logo="/images/tilt-card/bb-logo-vertical.svg"
          />
        </div>
      </div>
    </div>
  );
}
