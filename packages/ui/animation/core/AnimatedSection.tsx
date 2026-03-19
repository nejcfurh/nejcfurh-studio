'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedSection = (
  props: HTMLMotionProps<'section'>
): React.ReactNode => {
  return <motion.section {...props} />;
};

export default AnimatedSection;
