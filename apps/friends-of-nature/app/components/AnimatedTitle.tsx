'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

const AnimatedTitle = (props: HTMLMotionProps<'h1'>): React.ReactNode => {
  return <motion.h1 {...props} />;
};

export default AnimatedTitle;
