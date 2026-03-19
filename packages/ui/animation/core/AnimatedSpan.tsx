'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedSpan = (props: HTMLMotionProps<'span'>): React.ReactNode => {
  return <motion.span {...props} />;
};

export default AnimatedSpan;
