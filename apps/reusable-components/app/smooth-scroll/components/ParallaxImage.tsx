'use client';

import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'motion/react';
import { useRef } from 'react';

interface ParallaxImageProps {
  className?: string;
  alt: string;
  src: string;
  start: number;
  end: number;
}

const ParallaxImage = ({
  className,
  alt,
  src,
  start,
  end,
}: ParallaxImageProps) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);

  const yTransform = useTransform(scrollYProgress, [0, 1], [start, end]);

  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.5]);

  const transform = useMotionTemplate`translateY(${yTransform}px) scale(${scale})`;

  return (
    <motion.img
      style={{ opacity, transform }}
      ref={imageRef}
      className={className}
      alt={alt}
      src={src}
    />
  );
};

export default ParallaxImage;
