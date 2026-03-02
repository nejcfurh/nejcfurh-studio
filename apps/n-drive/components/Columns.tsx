'use client';

import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery } from 'convex/react';
import { formatRelative } from 'date-fns';
import { UserIcon } from 'lucide-react';
import ActionsDropdownMenu from './ActionsDropdownMenu';

const UserCell = ({ userId }: { userId: Id<'users'> }) => {
  const user = useQuery(api.users.getUserProfile, { userId });
  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-6">
        <AvatarImage
          src={user?.imageUrl ?? ''}
          alt={user?.name ?? ''}
          className="object-cover object-top h-full w-full rounded-full"
        />
        <AvatarFallback>
          <UserIcon className="size-6 rounded-full" />
        </AvatarFallback>
      </Avatar>
      <span className="text-xs font-medium text-muted-foreground">
        {user?.name}
      </span>
    </div>
  );
};

const ActionsCell = ({ file }: { file: Doc<'files'> }) => {
  const fileUrl = useQuery(api.files.getStorage, { fileId: file.fileId });
  const allFavorites = useQuery(api.files.queryAllFavorites, {
    organizationId: file.organizationId ?? '',
  });

  const isFavorite = (fileId: Id<'files'>) =>
    allFavorites?.some(favorite => favorite.fileId === fileId);

  return (
    <ActionsDropdownMenu
      file={file}
      fileUrl={fileUrl}
      isFavorite={isFavorite(file._id) ?? false}
    />
  );
};

export const columns: ColumnDef<Doc<'files'>>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    header: 'Uploaded by',
    cell: ({ row }) => {
      return <UserCell userId={row.original.userId} />;
    },
  },
  {
    header: 'Created At',
    cell: ({ row }) => {
      const creationTime = new Date(row.original._creationTime);
      return <div>{formatRelative(creationTime, new Date())}</div>;
    },
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      return <ActionsCell file={row.original} />;
    },
  },
];

export default columns;
