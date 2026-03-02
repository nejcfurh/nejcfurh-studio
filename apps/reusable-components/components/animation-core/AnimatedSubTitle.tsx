'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedSubTitle = (props: HTMLMotionProps<'h2'>) => {
  return <motion.h2 {...props} />;
};

export default AnimatedSubTitle;
