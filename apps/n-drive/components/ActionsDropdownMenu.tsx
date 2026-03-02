'use client';

import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { Doc } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from './ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { EllipsisVerticalIcon, Trash2Icon, Undo2Icon } from 'lucide-react';
import { Protect } from '@clerk/nextjs';
import Link from 'next/link';
import { DownloadIcon } from 'lucide-react';
import { HeartIcon } from 'lucide-react';

export const ActionsDropdownMenu = ({
  file,
  fileUrl,
  isFavorite,
}: {
  file: Doc<'files'>;
  fileUrl: string | null | undefined;
  isFavorite: boolean;
}) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const deleteFileMutation = useMutation(api.files.deleteFile);
  const toggleFavoritesMutation = useMutation(api.files.toggleFavorites);
  const restoreFileMutation = useMutation(api.files.restoreFile);
  const me = useQuery(api.users.getMe);

  const handleDelete = async () => {
    await deleteFileMutation({ fileId: file._id });
    setIsConfirmationOpen(false);
    toast.info('File marked for deletion successfully.');
  };

  const handleToggleFavorites = async () => {
    setIsConfirmationOpen(false);
    const result = await toggleFavoritesMutation({ fileId: file._id });

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error('Error occured. Please try again.');
    }
  };

  const handleRestore = async () => {
    await restoreFileMutation({ fileId: file._id });
    toast.success('File restored successfully.');
  };

  return (
    <>
      <AlertDialog
        open={isConfirmationOpen}
        onOpenChange={open => setIsConfirmationOpen(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will mark the file as deleted and it will be moved to the
              trash. You can restore it from the trash, but it will be
              permanently deleted after 24 hours.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
              onClick={handleDelete}
            >
              DELETE
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="cursor-pointer p-0">
            <EllipsisVerticalIcon className="size-4" />{' '}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <Protect
              condition={check => {
                return (
                  check({
                    role: 'org:admin',
                  }) || file.userId === me?._id
                );
              }}
            >
              {file.markedForDeletion && (
                <DropdownMenuItem
                  className="flex items-center justify-center gap-2 cursor-pointer"
                  onClick={handleRestore}
                >
                  <Undo2Icon className="size-4 text-green-500" />
                  Restore
                </DropdownMenuItem>
              )}
              {!file.markedForDeletion && (
                <DropdownMenuItem
                  className="flex items-center justify-center gap-2 cursor-pointer"
                  onClick={() => setIsConfirmationOpen(true)}
                >
                  <Trash2Icon className="size-4 text-red-500" />
                  Delete
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
            </Protect>
            {fileUrl && (
              <DropdownMenuItem className="flex items-center justify-center gap-2 cursor-pointer">
                <DownloadIcon className="size-4" />
                <Link target="_blank" href={fileUrl}>
                  Download
                </Link>
              </DropdownMenuItem>
            )}
            {!file.markedForDeletion && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center justify-center gap-2 cursor-pointer"
                  onClick={handleToggleFavorites}
                >
                  {isFavorite ? (
                    <>
                      <HeartIcon fill="red" stroke="red" className="size-4" />{' '}
                      Unfavorite
                    </>
                  ) : (
                    <>
                      <HeartIcon className="size-4" /> Favorite
                    </>
                  )}
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ActionsDropdownMenu;
