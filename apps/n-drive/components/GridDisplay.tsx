import { Doc } from '@/convex/_generated/dataModel';

import FileCard from './FileCard';

const GridDisplay = ({
  files,
  allFavorites
}: {
  files: Doc<'files'>[];
  allFavorites: Doc<'favorites'>[];
}) => {
  return (
    <div className="mt-12 grid grid-cols-3 gap-4">
      {files?.map((file) => (
        <FileCard
          key={file._id}
          file={file}
          allFavorites={allFavorites ?? []}
        />
      ))}
    </div>
  );
};

export default GridDisplay;
