import AnimatedDiv from '@/components/animation-core/AnimatedDiv';
import { IMG_PADDING } from '@/features/scroll-animation/constants';
import { useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface StickyImageProps {
  imgUrl: string;
}

const StickyImage = ({ imgUrl }: StickyImageProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['end end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <AnimatedDiv
      ref={targetRef}
      style={{
        scale,
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
      }}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <AnimatedDiv
        style={{ opacity }}
        className="absolute inset-0 bg-neutral-950/70"
      />
    </AnimatedDiv>
  );
};

export default StickyImage;
