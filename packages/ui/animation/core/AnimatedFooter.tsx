'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedFooter = (props: HTMLMotionProps<'footer'>): React.ReactNode => {
  return <motion.footer {...props} />;
};

export default AnimatedFooter;
