'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

const AnimatedSubTitle = (props: HTMLMotionProps<'h2'>): React.ReactNode => {
  return <motion.h2 {...props} />;
};

export default AnimatedSubTitle;
