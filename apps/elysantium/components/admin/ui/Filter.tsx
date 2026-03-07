'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterProps {
  filterField: string;
  options: FilterOption[];
}

function Filter({ filterField, options }: FilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentFilter = searchParams.get(filterField) || options.at(0)?.value;

  function handleClick(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(filterField, value);
    if (params.get('page')) params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 rounded-[var(--border-radius-sm)] border border-[var(--color-grey-100)] bg-[var(--color-grey-0)] p-1 shadow-[var(--shadow-sm)]">
      {options.map((option) => (
        <button
          key={option.value}
          value={option.value}
          onClick={() => handleClick(option.value)}
          disabled={option.value === currentFilter}
          className={`rounded-[var(--border-radius-sm)] border-none px-2 py-[0.44rem] text-sm font-medium transition-all duration-300 hover:not-disabled:bg-[var(--color-brand-600)] hover:not-disabled:text-[var(--color-brand-50)] ${
            option.value === currentFilter
              ? 'bg-[var(--color-brand-600)] text-[var(--color-brand-50)]'
              : 'bg-[var(--color-grey-0)]'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default Filter;
