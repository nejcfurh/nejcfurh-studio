'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedButton = (props: HTMLMotionProps<'button'>): React.ReactNode => {
  return <motion.button {...props} />;
};

export default AnimatedButton;
