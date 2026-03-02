'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedTitle = (props: HTMLMotionProps<'h1'>) => {
  return <motion.h1 {...props} />;
};

export default AnimatedTitle;
