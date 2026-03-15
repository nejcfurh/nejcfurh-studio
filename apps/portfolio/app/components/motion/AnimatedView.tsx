'use client';

import type { JSX, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  className?: string;
}

const AnimatedView = ({ children, className }: Props): JSX.Element => {
  return <div className={className}>{children}</div>;
};

export default AnimatedView;
