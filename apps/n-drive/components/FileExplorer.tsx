'use client';

import EmptyStatePlaceholder from '@/components/EmptyStatePlaceholder';
import SearchBar from '@/components/SearchBar';
import UploadFile from '@/components/UploadFile';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Loader2Icon } from 'lucide-react';
import { Activity, useState } from 'react';

import columns from './Columns';
import DisplaySelectionTab from './DisplaySelectionTab';
import FileTypeFilter from './FileTypeFilter';
import GridDisplay from './GridDisplay';
import TableDisplay from './TableDisplay';

const FileExplorer = ({
  title,
  favorites,
  markedForDeletion
}: {
  title: string;
  favorites?: boolean;
  markedForDeletion?: boolean;
}) => {
  const { isLoaded, organization } = useOrganization();
  const { isLoaded: isUserLoaded, user } = useUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [display, setDisplay] = useState<'grid' | 'table'>('grid');
  const [fileType, setFileType] = useState<Doc<'files'>['type'] | 'all'>('all');

  let organizationId: string | undefined;

  if (isLoaded && isUserLoaded) {
    organizationId = organization?.id ?? user?.id;
  }

  const files = useQuery(
    api.files.getFiles,
    organizationId
      ? {
          organizationId,
          searchQuery,
          favorites,
          markedForDeletion,
          fileType: fileType === 'all' ? undefined : fileType
        }
      : 'skip'
  );

  const allFavorites = useQuery(
    api.files.queryAllFavorites,
    organizationId ? { organizationId } : 'skip'
  );

  const handleSearchQueryChange = (searchQuery: string) => {
    setSearchQuery(searchQuery);
  };

  const handleDisplayChange = (display: 'grid' | 'table') => {
    setDisplay(display);
  };

  const handleFileTypeChange = (value: Doc<'files'>['type'] | 'all') => {
    setFileType(value);
  };

  const isLoading = files === undefined;

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          <div className="flex items-center gap-2">
            {title}
            <DisplaySelectionTab
              display={display}
              handleChange={handleDisplayChange}
            />
            <FileTypeFilter
              handleChangeType={handleFileTypeChange}
              fileType={fileType}
            />
          </div>
        </h1>
        <div className="flex min-h-14 items-center justify-end gap-8">
          <SearchBar setSearchQuery={handleSearchQueryChange} />
          <UploadFile organizationId={organizationId!} />
        </div>
      </div>

      {files?.length === 0 && (
        <EmptyStatePlaceholder organizationId={organizationId!} />
      )}

      {isLoading && (
        <div className="mt-24 flex h-full flex-col items-center gap-4">
          <Loader2Icon className="size-32 animate-spin text-gray-500" />
          <p className="text-2xl font-semibold">Loading your files ...</p>
        </div>
      )}

      {files && files.length > 0 && (
        <>
          <Activity mode={display === 'table' ? 'visible' : 'hidden'}>
            <TableDisplay columns={columns} data={files ?? []} />
          </Activity>
          <Activity mode={display === 'grid' ? 'visible' : 'hidden'}>
            <GridDisplay
              files={files ?? []}
              allFavorites={allFavorites ?? []}
            />
          </Activity>
        </>
      )}
    </>
  );
};

export default FileExplorer;
