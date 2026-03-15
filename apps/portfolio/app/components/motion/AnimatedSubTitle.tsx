'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { JSX } from 'react';

const AnimatedSubTitle = (props: HTMLMotionProps<'h2'>): JSX.Element => {
  return <motion.h2 {...props} />;
};

export default AnimatedSubTitle;
