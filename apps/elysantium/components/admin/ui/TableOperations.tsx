'use client';

import React from 'react';

interface TableOperationsProps {
  children: React.ReactNode;
}

function TableOperations({ children }: TableOperationsProps) {
  return <div className="flex items-center gap-4">{children}</div>;
}

export default TableOperations;
