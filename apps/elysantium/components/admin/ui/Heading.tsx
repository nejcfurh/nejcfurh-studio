'use client';

import React from 'react';

interface HeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  children: React.ReactNode;
  className?: string;
}

const headingClasses: Record<string, string> = {
  h1: 'text-3xl font-semibold leading-[1.4]',
  h2: 'text-xl font-semibold leading-[1.4]',
  h3: 'text-lg font-medium leading-[1.4]',
  h4: 'text-3xl font-semibold text-center leading-[1.4]'
};

function Heading({ as: Tag = 'h1', children, className = '' }: HeadingProps) {
  return (
    <Tag className={`${headingClasses[Tag]} ${className}`}>{children}</Tag>
  );
}

export default Heading;
