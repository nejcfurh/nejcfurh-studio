import AnimatedDiv from '@/components/animation-core/AnimatedDiv';
import { useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface OverlayCopyProps {
  subheading: string;
  heading: string;
}

const OverlayCopy = ({ subheading, heading }: OverlayCopyProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start']
  });

  const yPosition = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <AnimatedDiv
      ref={targetRef}
      style={{ y: yPosition, opacity }}
      className="absolute top-0 left-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">
        {subheading}
      </p>
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
    </AnimatedDiv>
  );
};

export default OverlayCopy;
