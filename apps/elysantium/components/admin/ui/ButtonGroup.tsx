'use client';

import React from 'react';

interface ButtonGroupProps {
  children: React.ReactNode;
}

function ButtonGroup({ children }: ButtonGroupProps) {
  return <div className="flex justify-end gap-3">{children}</div>;
}

export default ButtonGroup;
