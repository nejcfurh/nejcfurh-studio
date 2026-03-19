'use client';

import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const AnimatedNav = (props: HTMLMotionProps<'nav'>): React.ReactNode => {
  return <motion.nav {...props} />;
};

export default AnimatedNav;
