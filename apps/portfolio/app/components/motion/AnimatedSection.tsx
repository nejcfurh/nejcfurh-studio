'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { JSX } from 'react';

const AnimatedSection = (props: HTMLMotionProps<'section'>): JSX.Element => {
  return <motion.section {...props} />;
};

export default AnimatedSection;
