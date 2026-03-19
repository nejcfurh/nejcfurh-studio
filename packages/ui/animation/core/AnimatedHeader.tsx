'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedHeader = (props: HTMLMotionProps<'header'>): React.ReactNode => {
  return <motion.header {...props} />;
};

export default AnimatedHeader;
