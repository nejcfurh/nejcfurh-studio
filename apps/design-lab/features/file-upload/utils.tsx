import { BsFiletypePdf } from '@repo/ui/icons/react-icons/bs';
import { CiImageOn, CiVideoOn } from '@repo/ui/icons/react-icons/ci';
import { FaRegFolderOpen } from '@repo/ui/icons/react-icons/fa';
import { GoFileZip } from '@repo/ui/icons/react-icons/go';
import { IoDocumentTextOutline } from '@repo/ui/icons/react-icons/io5';
import { LuSheet } from '@repo/ui/icons/react-icons/lu';
import { PiFileAudioFill } from '@repo/ui/icons/react-icons/pi';

export const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <CiImageOn />;
  if (type.startsWith('video/')) return <CiVideoOn />;
  if (type.startsWith('audio/')) return <PiFileAudioFill />;
  if (type.includes('pdf')) return <BsFiletypePdf />;
  if (type.includes('word') || type.includes('document'))
    return <IoDocumentTextOutline />;
  if (type.includes('sheet') || type.includes('excel')) return <LuSheet />;
  if (type.includes('zip') || type.includes('rar')) return <GoFileZip />;
  return <FaRegFolderOpen />;
};
