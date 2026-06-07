'use client';

import ScrollDownIndicator from '@/components/ScrollDownIndicator';
import { Variants } from '@repo/ui/animation';
import {
  AnimatedDiv,
  AnimatedSubTitle,
  AnimatedText
} from '@repo/ui/animation/core';

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  }
};

// Content of a description panel — the panel wrapper owns the scroll transforms.
// The text staggers in (fade up from below) whenever the panel scrolls into view.
const DescriptionSection = ({
  title,
  description,
  color
}: {
  title: string;
  description: string;
  color: string;
}) => {
  return (
    <AnimatedDiv
      style={{ backgroundColor: color }}
      className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-6 text-center text-white"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.6 }}
    >
      <AnimatedSubTitle
        variants={item}
        className="max-w-4xl text-[8vw] leading-none font-semibold md:text-[4vw]"
      >
        {title}
      </AnimatedSubTitle>
      <AnimatedText
        variants={item}
        className="max-w-xl text-base text-white/75 md:text-lg"
      >
        {description}
      </AnimatedText>

      <AnimatedDiv variants={item} className="absolute bottom-8">
        <ScrollDownIndicator />
      </AnimatedDiv>
    </AnimatedDiv>
  );
};

export default DescriptionSection;
