import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { formatRelative } from 'date-fns';
import {
  FileAxis3D,
  FileTextIcon,
  FileType2,
  ImageIcon,
  UserIcon,
  VideoIcon
} from 'lucide-react';
import Image from 'next/image';

import ActionsDropdownMenu from './ActionsDropdownMenu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const FileCard = ({
  file,
  allFavorites
}: {
  file: Doc<'files'>;
  allFavorites: Doc<'favorites'>[];
}) => {
  const fileTypeIcon = {
    image: <ImageIcon className="size-6" />,
    video: <VideoIcon className="size-6" />,
    csv: <FileTextIcon className="size-6" />,
    pdf: <FileTextIcon className="size-6" />
  } as Record<Doc<'files'>['type'], React.ReactNode>;

  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId
  });

  const fileUrl = useQuery(api.files.getStorage, { fileId: file.fileId });

  const isFavorite = (fileId: Id<'files'>) =>
    allFavorites.some((favorite) => favorite.fileId === fileId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-2xl">
            {fileTypeIcon[file.type]} {file.name}
          </div>
          <ActionsDropdownMenu
            file={file}
            fileUrl={fileUrl}
            isFavorite={isFavorite(file._id)}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col items-center justify-end">
        {file.type === 'image' && fileUrl && (
          <Image
            src={fileUrl}
            alt={file.name}
            width={300}
            loading="lazy"
            height={300}
            className="mb-2 h-full max-h-60 w-full rounded-lg"
          />
        )}

        {file.type === 'pdf' && fileUrl && (
          <FileAxis3D className="mb-2 h-full max-h-60 w-full" />
        )}

        {file.type === 'csv' && fileUrl && (
          <FileType2 className="mb-2 h-full max-h-60 w-full" />
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">
              Uploaded{' '}
              <span className="text-xs font-bold">
                {formatRelative(new Date(file._creationTime), new Date())}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Avatar className="size-6">
              <AvatarImage
                src={userProfile?.imageUrl}
                alt={userProfile?.name ?? ''}
                className="object-cover object-top"
              />
              <AvatarFallback>
                <UserIcon className="size-6" />
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-xs font-medium">
              {userProfile?.name}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
