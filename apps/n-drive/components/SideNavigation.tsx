'use client';

import { cn } from '@/lib/utils';
import { FileIcon, HeartIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from './ui/button';

const SideNavigation = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.includes(path);

  return (
    <div className="flex w-40 flex-col gap-4 pt-2">
      <Link href="/dashboard/files">
        <Button
          variant="link"
          className={cn(
            'flex cursor-pointer items-center gap-2 text-base',
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
            'flex cursor-pointer items-center gap-2 text-base',
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
            'flex cursor-pointer items-center gap-2 text-base',
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
