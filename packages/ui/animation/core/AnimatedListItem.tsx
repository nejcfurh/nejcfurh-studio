'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedListItem = (props: HTMLMotionProps<'li'>): React.ReactNode => {
  return <motion.li {...props} />;
};

export default AnimatedListItem;
