'use client';

import EmptyStatePlaceholder from '@/components/EmptyStatePlaceholder';
import SearchBar from '@/components/SearchBar';
import UploadFile from '@/components/UploadFile';
import { api } from '@/convex/_generated/api';
import { useOrganization, useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Loader2Icon } from 'lucide-react';
import { Activity, useState } from 'react';
import GridDisplay from './GridDisplay';
import TableDisplay from './TableDisplay';
import columns from './Columns';
import DisplaySelectionTab from './DisplaySelectionTab';
import FileTypeFilter from './FileTypeFilter';
import { Doc } from '@/convex/_generated/dataModel';

const FileExplorer = ({
  title,
  favorites,
  markedForDeletion,
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
          fileType: fileType === 'all' ? undefined : fileType,
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
      <div className="flex justify-between items-center">
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
        <div className="flex items-center justify-end gap-8 min-h-14">
          <SearchBar setSearchQuery={handleSearchQueryChange} />
          <UploadFile organizationId={organizationId!} />
        </div>
      </div>

      {files?.length === 0 && (
        <EmptyStatePlaceholder organizationId={organizationId!} />
      )}

      {isLoading && (
        <div className="flex flex-col items-center h-full gap-4 mt-24">
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
