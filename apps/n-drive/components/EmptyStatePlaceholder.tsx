import Image from 'next/image';
import { usePathname } from 'next/navigation';

import UploadFile from './UploadFile';

const EmptyStatePlaceholder = ({
  organizationId
}: {
  organizationId: string;
}) => {
  const pathname = usePathname();

  const isFilesPage = pathname === '/dashboard/files';
  const isDeletedPage = pathname === '/dashboard/trash';
  const isFavoritesPage = pathname === '/dashboard/favorites';

  return (
    <div className="mt-14 flex flex-col items-center justify-center gap-8">
      {/* FILES PAGE */}
      {isFilesPage && (
        <Image
          src="/ilustrations/empty-state.svg"
          alt="image of empty state"
          width={400}
          height={400}
        />
      )}
      {/* FAVORITES PAGE */}
      {isFavoritesPage && (
        <Image
          src="/ilustrations/favorites.svg"
          alt="image of empty state"
          width={400}
          height={400}
        />
      )}
      {/* TRASH PAGE */}
      {isDeletedPage && (
        <Image
          src="/ilustrations/trash.svg"
          alt="image of empty state"
          width={600}
          height={600}
          className="p-8"
        />
      )}

      <h2 className="text-2xl font-bold">
        {isFilesPage
          ? 'No files found'
          : isDeletedPage
            ? 'There are no recently deleted files'
            : 'You have not added any favorites yet'}
      </h2>
      {!isDeletedPage ||
        (isFilesPage && (
          <>
            <p className="text-muted-foreground mt-1">
              Upload a file to get started.
            </p>
            <UploadFile organizationId={organizationId!} />
          </>
        ))}
    </div>
  );
};

export default EmptyStatePlaceholder;
