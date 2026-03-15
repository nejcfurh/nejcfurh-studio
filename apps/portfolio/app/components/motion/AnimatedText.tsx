'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { JSX } from 'react';

const AnimatedText = (props: HTMLMotionProps<'p'>): JSX.Element => {
  return <motion.p {...props} />;
};

export default AnimatedText;
