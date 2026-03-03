'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

const AnimatedDiv = (props: HTMLMotionProps<'div'>): React.ReactNode => {
  return <motion.div {...props} />;
};

export default AnimatedDiv;
