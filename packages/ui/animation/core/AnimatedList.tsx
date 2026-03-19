'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedList = (props: HTMLMotionProps<'ul'>): React.ReactNode => {
  return <motion.ul {...props} />;
};

export default AnimatedList;
