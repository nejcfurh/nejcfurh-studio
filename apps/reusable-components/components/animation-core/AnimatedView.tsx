'use client';

import type { PropsWithChildren } from 'react';
import AnimatedDiv from './AnimatedDiv';

interface Props extends PropsWithChildren {
  className?: string;
}

const AnimatedView = ({ children, className }: Props) => {
  return <AnimatedDiv className={className}>{children}</AnimatedDiv>;
};

export default AnimatedView;
