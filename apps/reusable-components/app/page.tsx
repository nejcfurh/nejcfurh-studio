import AnimatedBackgroundGradient from '@/components/animation-core/AnimatedBackgroundGradient';
import AnimatedDiv from '@/components/animation-core/AnimatedDiv';
import FloatingOrb from '@/components/animation-core/FloatingOrb';
import Background from '@/components/Background';
import CustomLinkButton from '@/components/buttons/CustomLinkButton';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { MAIN_PAGE_DATA } from '@/constants/constants';
import { MainPageItem } from '@/utils/types';

import TiltCard from './tilt-card/components/TiltCard';

export default function Home() {
  return (
    <Background>
      <AnimatedBackgroundGradient />
      <FloatingOrb className="absolute top-20 left-10 h-72 w-72 animate-pulse rounded-full bg-blue-400/20 blur-3xl dark:bg-blue-500/10" />
      <div className="z-50 mx-auto flex min-h-screen w-full flex-col items-center justify-around px-3 sm:px-6">
        {/* HEADER */}
        <Header title="Reusable Components" />
        {/* MOBILE VIEW CARD - HIDDEN ON DESKTOP */}
        <div className="block sm:hidden">
          <TiltCard
            name="Nejc Furh"
            title="Product Engineer"
            imageUrl="/images/tilt-card/portrait.jpeg"
            logo="/images/tilt-card/bb-logo-vertical.svg"
          />
        </div>
        {/* COMPONENTS GRID - HIDDEN ON MOBILE */}
        <AnimatedDiv className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {MAIN_PAGE_DATA.map((component: MainPageItem) => (
            <CustomLinkButton
              key={component.path}
              name={component.name}
              path={component.path}
              icon={component.icon}
              color={component.color}
            />
          ))}
        </AnimatedDiv>

        {/* FOOTER */}
        <Footer year={2025} />
      </div>
    </Background>
  );
}
