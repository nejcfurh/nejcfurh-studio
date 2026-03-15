'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { JSX } from 'react';

const AnimatedTitle = (props: HTMLMotionProps<'h1'>): JSX.Element => {
  return <motion.h1 {...props} />;
};

export default AnimatedTitle;
