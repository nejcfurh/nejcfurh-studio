'use client';

import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  className?: string;
}

const AnimatedView = ({ children, className }: Props): React.ReactNode => {
  return <div className={className}>{children}</div>;
};

export default AnimatedView;
