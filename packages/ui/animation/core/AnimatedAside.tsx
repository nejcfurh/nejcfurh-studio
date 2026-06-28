'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedAside = (props: HTMLMotionProps<'aside'>): React.ReactNode => {
  return <motion.aside {...props} />;
};

export default AnimatedAside;
