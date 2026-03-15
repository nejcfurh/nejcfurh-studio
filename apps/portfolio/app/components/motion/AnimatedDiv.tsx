'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { JSX } from 'react';

const AnimatedDiv = (props: HTMLMotionProps<'div'>): JSX.Element => {
  return <motion.div {...props} />;
};

export default AnimatedDiv;
