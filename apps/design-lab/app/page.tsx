import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import Background from '@/components/Background';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ScrollDownIndicator from '@/components/ScrollDownIndicator';
import SectionGrid from '@/components/SectionGrid';
import SectionTitle from '@/components/SectionTitle';
import {
  ANIMATIONS_DATA,
  CLONES_DATA,
  COMPONENTS_DATA,
  TOOLS_DATA
} from '@/constants/constants';
import { AnalyticsClientPageEvent } from '@/features/analytics/types.client';
import TiltCard from '@/features/tilt-card/components/TiltCard';
import { PageName } from '@/utils/constants/page.data';
import { PageVisitTracker } from '@analytics/components/PageVisitTracker';
import { AnimatedDiv } from '@repo/ui/animation/core';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <Background>
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <div className="z-50 mx-auto flex min-h-screen w-full flex-col items-center px-3 sm:justify-around sm:px-6">
        <section className="flex min-h-screen w-full flex-col items-center sm:contents">
          {/* HEADER */}
          <AnimatedDiv className="flex w-full flex-col items-center justify-center">
            <Header title="Design Lab" />
            <div className="flex items-center justify-center gap-2 text-gray-400">
              by{' '}
              <Link
                href="https://nejcfurh.dev"
                target="_blank"
                className="z-50 cursor-pointer transition-opacity duration-300 hover:opacity-80"
              >
                <Image
                  height={100}
                  width={150}
                  src={'/images/tilt-card/Logo.png'}
                  alt="logo"
                />
              </Link>
            </div>
          </AnimatedDiv>

          {/* MOBILE CARD — centered in the remaining space - HIDDEN ON DESKTOP */}
          <div className="flex flex-1 items-center justify-center sm:hidden">
            <TiltCard
              name="Nejc Furh"
              title="Product Engineer"
              imageUrl="/images/tilt-card/portrait.jpeg"
              logo="/images/tilt-card/bb-logo-vertical.svg"
            />
          </div>

          {/* MOBILE SCROLL HINT - HIDDEN ON DESKTOP */}
          <a
            href="#explore"
            aria-label="Scroll down to explore"
            className="z-50 mb-8 transition-opacity duration-300 hover:opacity-90 sm:hidden"
          >
            <ScrollDownIndicator />
          </a>
        </section>

        {/* SECTIONS */}
        <div
          id="explore"
          className="w-full max-w-6xl scroll-mt-6 px-4 pt-4 sm:px-0 sm:pt-0"
        >
          <SectionTitle>Animations</SectionTitle>
          <SectionGrid items={ANIMATIONS_DATA} />

          <SectionTitle>Components</SectionTitle>
          <SectionGrid items={COMPONENTS_DATA} />

          <SectionTitle>UI Clones, Landing Pages & Tools</SectionTitle>
          <SectionGrid items={[...CLONES_DATA, ...TOOLS_DATA]} />
        </div>

        {/* FOOTER */}
        <Footer year={2026} />
      </div>
      <PageVisitTracker<AnalyticsClientPageEvent>
        pageEvent={{
          pageName: PageName.DESIGN_LAB
        }}
      />
    </Background>
  );
}
