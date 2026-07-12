'use client';

import { PAGE_SIZE } from '@/lib/utils/constants';
import { HiChevronLeft, HiChevronRight } from '@repo/ui/icons/react-icons/hi2';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface PaginationProps {
  count: number;
}

function Pagination({ count }: PaginationProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = !searchParams.get('page')
    ? 1
    : Number(searchParams.get('page'));

  const pageCount = Math.ceil(count / PAGE_SIZE);

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(next));
    router.push(`${pathname}?${params.toString()}`);
  }

  function previousPage() {
    const previous = currentPage === 1 ? currentPage : currentPage - 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(previous));
    router.push(`${pathname}?${params.toString()}`);
  }

  if (pageCount <= 1) return null;

  return (
    <div className="flex w-full items-center justify-between">
      <p className="ml-2 text-sm [&_span]:font-semibold">
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{' '}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{' '}
        of <span>{count}</span> results
      </p>
      <div className="flex gap-1.5">
        <button
          onClick={previousPage}
          disabled={currentPage === 1}
          className="g-(--color-grey-50) flex items-center justify-center gap-1 rounded-(--border-radius-sm) border-none px-3 py-1.5 text-sm font-medium transition-all duration-300 hover:not-disabled:bg-(--color-brand-600) hover:not-disabled:text-(--color-brand-50) [&_svg]:h-4.5 [&_svg]:w-4.5"
        >
          <HiChevronLeft /> <span>Previous</span>
        </button>
        <button
          onClick={nextPage}
          disabled={currentPage === pageCount}
          className="flex items-center justify-center gap-1 rounded-(--border-radius-sm) border-none bg-(--color-grey-50) px-3 py-1.5 text-sm font-medium transition-all duration-300 hover:not-disabled:bg-(--color-brand-600) hover:not-disabled:text-(--color-brand-50) [&_svg]:h-4.5 [&_svg]:w-4.5"
        >
          <span>Next</span>
          <HiChevronRight />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
