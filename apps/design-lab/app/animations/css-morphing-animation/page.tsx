'use client';

import AnimationTitle from '@/components/AnimationTitle';
import Background from '@/components/Background';
import BackButton from '@/components/buttons/BackButton';
import useInteractiveBubble from '@/features/css-morphing-animation/hooks/useInteractiveBubble';

const CSSMorphingAnimationPage = () => {
  const interactiveBubbleRef = useInteractiveBubble();

  return (
    <Background className="flex items-center justify-center px-4 pt-28 pb-10">
      <BackButton className="top-5 left-5" />
      <AnimationTitle
        title="CSS Morphing Animation"
        subtitle="A CSS morphing animation that is used to create a interactive bubble that reacts to mouse movement."
      />
      <div className="gradient-background">
        {/* SVG FILTER FOR THE INTERACTIVE BUBBLE */}
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="10"
                result="blur"
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in2="goo" in="SourceGraphic" />
            </filter>
          </defs>
        </svg>
        <div className="gradient-container">
          <div className="gradient-1" />
          <div className="gradient-2" />
          <div className="gradient-3" />
          <div className="gradient-4" />
          <div className="gradient-5" />
          <div ref={interactiveBubbleRef} className="interactive" />
        </div>
      </div>
    </Background>
  );
};

export default CSSMorphingAnimationPage;
