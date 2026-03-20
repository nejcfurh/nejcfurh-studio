import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import Background from '@/components/Background';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import SectionGrid from '@/components/SectionGrid';
import SectionTitle from '@/components/SectionTitle';
import {
  ANIMATIONS_DATA,
  CLONES_DATA,
  COMPONENTS_DATA,
  TOOLS_DATA
} from '@/constants/constants';
import { AnimatedDiv } from '@repo/ui/animation/core';
import Image from 'next/image';

import TiltCard from './animations/tilt-card/components/TiltCard';

export default function Home() {
  return (
    <Background>
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <div className="z-50 mx-auto flex min-h-screen w-full flex-col items-center justify-around px-3 sm:px-6">
        {/* HEADER */}
        <AnimatedDiv className="flex w-full flex-col items-center justify-center">
          <Header title="Design Lab" />
          <div className="flex items-center justify-center gap-2">
            by{' '}
            <Image
              height={100}
              width={150}
              src={'/images/tilt-card/Logo.png'}
              alt="logo"
            />
          </div>
        </AnimatedDiv>

        {/* MOBILE VIEW CARD - HIDDEN ON DESKTOP */}
        <div className="block sm:hidden">
          <TiltCard
            name="Nejc Furh"
            title="Product Engineer"
            imageUrl="/images/tilt-card/portrait.jpeg"
            logo="/images/tilt-card/bb-logo-vertical.svg"
          />
        </div>

        {/* SECTIONS - HIDDEN ON MOBILE */}
        <div className="hidden w-full max-w-6xl sm:block">
          <SectionTitle>Animations</SectionTitle>
          <SectionGrid items={ANIMATIONS_DATA} />

          <SectionTitle>Components</SectionTitle>
          <SectionGrid items={COMPONENTS_DATA} />

          <SectionTitle>UI Clones, Landing Pages & Tools</SectionTitle>
          <SectionGrid items={[...CLONES_DATA, ...TOOLS_DATA]} />
        </div>

        {/* FOOTER */}
        <Footer year={2025} />
      </div>
    </Background>
  );
}
