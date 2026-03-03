'use client';

import AnimatedDiv from '@/components/animation-core/AnimatedDiv';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';
import { useMousePosition } from '@/hooks/useMousePosition';
import { useState } from 'react';

const MaskCursorEffectPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = useMousePosition();
  const maskSize = isHovered ? 400 : 40;

  return (
    <Background className="h-screen bg-black">
      <BackButton className="top-5 left-5 hover:opacity-100" />
      <h1 className="absolute top-5 w-full text-center text-5xl font-semibold text-white">
        Mask Cursor Effect
      </h1>
      {/* MASK */}
      <AnimatedDiv
        transition={{
          type: 'tween',
          ease: 'backOut'
        }}
        animate={{
          maskPosition: `${x - maskSize / 2}px ${y - maskSize / 2}px`,
          maskSize: `${maskSize}px`
        }}
        className="absolute flex h-full w-full cursor-none! items-center justify-center text-6xl leading-16 font-bold"
        style={{
          maskImage: 'url(/images/mask-cursor-effect/mask.svg)',
          maskRepeat: 'no-repeat',
          backgroundColor: '#e23720',
          color: 'black'
        }}
      >
        <p
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-[1100px] cursor-none! px-10 py-10"
        >
          A visual designer - with skills that haven&apos;t been replaced by{' '}
          <span className="bg-black text-[#e23720]">AI (yet)</span> - making
          good shit only if the paycheck is equally good.
        </p>
      </AnimatedDiv>
      {/* BODY */}
      <div className="pointer-events-none flex h-full w-full cursor-none! items-center justify-center text-6xl leading-16 font-bold">
        <p className="w-[1100px] px-10 py-10">
          I&apos;m a <span className="bg-[#e23720]">selectivelly skilled</span>{' '}
          web developer with strong focus on producing high-quality & impactful
          digital experiences.
        </p>
      </div>
    </Background>
  );
};

export default MaskCursorEffectPage;
