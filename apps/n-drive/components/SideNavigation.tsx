'use client';

import Link from 'next/link';
import { Button } from './ui/button';
import { FileIcon, HeartIcon, TrashIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const SideNavigation = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.includes(path);

  return (
    <div className="w-40 flex flex-col gap-4 pt-2">
      <Link href="/dashboard/files">
        <Button
          variant="link"
          className={cn(
            'flex gap-2 items-center text-base cursor-pointer',
            isActive('/dashboard/files') && 'font-bold'
          )}
        >
          {' '}
          <FileIcon className="size-6" /> All Files
        </Button>
      </Link>
      <Link href="/dashboard/favorites">
        <Button
          variant="link"
          className={cn(
            'flex gap-2 items-center text-base cursor-pointer',
            isActive('/dashboard/favorites') && 'text-underline font-bold'
          )}
        >
          {' '}
          <HeartIcon className="size-6" /> Favorites
        </Button>
      </Link>
      <Link href="/dashboard/trash">
        <Button
          variant="link"
          className={cn(
            'flex gap-2 items-center text-base cursor-pointer',
            isActive('/dashboard/trash') && 'text-underline font-bold'
          )}
        >
          {' '}
          <TrashIcon className="size-6" /> Trash
        </Button>
      </Link>
    </div>
  );
};

export default SideNavigation;
