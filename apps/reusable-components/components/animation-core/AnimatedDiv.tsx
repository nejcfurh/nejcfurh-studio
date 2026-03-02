'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedDiv = (props: HTMLMotionProps<'div'>) => {
  return <motion.div {...props} />;
};

export default AnimatedDiv;
