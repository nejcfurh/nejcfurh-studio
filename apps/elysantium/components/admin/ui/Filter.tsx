'use client';

import { motion, useReducedMotion } from '@repo/ui/animation';
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
  const reduce = useReducedMotion();

  const currentFilter = searchParams.get(filterField) || options.at(0)?.value;

  function handleClick(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(filterField, value);
    if (params.get('page')) params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 rounded-full border border-(--color-grey-100) bg-(--color-grey-0) p-1 shadow-(--shadow-sm)">
      {options.map((option) => {
        const isActive = option.value === currentFilter;
        return (
          <button
            key={option.value}
            value={option.value}
            onClick={() => handleClick(option.value)}
            disabled={isActive}
            className="relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200"
          >
            {isActive && (
              <motion.span
                layoutId={`filter-${filterField}`}
                className="absolute inset-0 rounded-full bg-(--color-brand-600)"
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: 'spring', duration: 0.4, bounce: 0.15 }
                }
              />
            )}
            <span
              className={`relative z-10 ${
                isActive
                  ? 'text-(--color-brand-50)'
                  : 'text-(--color-grey-600) hover:text-(--color-grey-800)'
              }`}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default Filter;
