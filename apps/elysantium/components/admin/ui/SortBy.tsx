'use client';

import Select from '@/components/admin/ui/Select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

interface SortByOption {
  value: string;
  label: string;
}

interface SortByProps {
  options: SortByOption[];
}

function SortBy({ options }: SortByProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sortBy = searchParams.get('sortBy') || '';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortBy', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Select
      options={options}
      type="white"
      onChange={handleChange}
      value={sortBy}
    />
  );
}

export default SortBy;
