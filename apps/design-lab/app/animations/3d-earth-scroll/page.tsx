import AnimationTitle from '@/components/AnimationTitle';
import BackButton from '@/components/buttons/BackButton';
import ScrollHint from '@/features/3d-earth-scroll/components/ScrollHint';
import ThreeDEarthScroll from '@/features/3d-earth-scroll/components/ThreeDEarthScroll';
import { Lenis } from 'lenis/react';

const ThreeDEarthScrollPage = () => {
  return (
    <div className="h-full w-full">
      <Lenis root options={{ lerp: 0.05 }}>
        <BackButton className="fixed top-5 left-5" />
        <AnimationTitle
          title="3D Earth Scroll"
          subtitle="A 3D earth scroll animation built with React, Three.js, and Tailwind CSS. Inspired by Olivier Larose."
        />
        <ThreeDEarthScroll />
        <ScrollHint />
      </Lenis>
    </div>
  );
};

export default ThreeDEarthScrollPage;
