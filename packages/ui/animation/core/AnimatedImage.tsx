'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedImage = (props: HTMLMotionProps<'img'>): React.ReactNode => {
  return <motion.img {...props} />;
};

export default AnimatedImage;
