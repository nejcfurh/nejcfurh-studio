'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedText = (props: HTMLMotionProps<'p'>) => {
  return <motion.p {...props} />;
};

export default AnimatedText;
