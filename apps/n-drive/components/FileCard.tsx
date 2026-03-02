import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Doc, Id } from '@/convex/_generated/dataModel';
import ActionsDropdownMenu from './ActionsDropdownMenu';
import {
  FileAxis3D,
  FileTextIcon,
  FileType2,
  ImageIcon,
  UserIcon,
  VideoIcon,
} from 'lucide-react';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatRelative } from 'date-fns';

const FileCard = ({
  file,
  allFavorites,
}: {
  file: Doc<'files'>;
  allFavorites: Doc<'favorites'>[];
}) => {
  const fileTypeIcon = {
    image: <ImageIcon className="size-6" />,
    video: <VideoIcon className="size-6 " />,
    csv: <FileTextIcon className="size-6" />,
    pdf: <FileTextIcon className="size-6" />,
  } as Record<Doc<'files'>['type'], React.ReactNode>;

  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  const fileUrl = useQuery(api.files.getStorage, { fileId: file.fileId });

  const isFavorite = (fileId: Id<'files'>) =>
    allFavorites.some(favorite => favorite.fileId === fileId);

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
      <CardContent className="flex flex-col h-full items-center justify-end">
        {file.type === 'image' && fileUrl && (
          <Image
            src={fileUrl}
            alt={file.name}
            width={300}
            loading="lazy"
            height={300}
            className="w-full h-full max-h-60 mb-2 rounded-lg"
          />
        )}

        {file.type === 'pdf' && fileUrl && (
          <FileAxis3D className="w-full h-full max-h-60 mb-2" />
        )}

        {file.type === 'csv' && fileUrl && (
          <FileType2 className="w-full h-full max-h-60 mb-2" />
        )}
      </CardContent>
      <CardFooter>
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              Uploaded{' '}
              <span className="font-bold text-xs">
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
            <span className="text-xs font-medium text-muted-foreground">
              {userProfile?.name}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
