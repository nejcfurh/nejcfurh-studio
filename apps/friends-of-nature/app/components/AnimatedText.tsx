'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

const AnimatedText = (props: HTMLMotionProps<'p'>): React.ReactNode => {
  return <motion.p {...props} />;
};

export default AnimatedText;
