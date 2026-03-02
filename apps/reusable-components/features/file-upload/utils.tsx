import { BsFiletypePdf } from 'react-icons/bs';
import { CiImageOn, CiVideoOn } from 'react-icons/ci';
import { FaRegFolderOpen } from 'react-icons/fa';
import { GoFileZip } from 'react-icons/go';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { LuSheet } from 'react-icons/lu';
import { PiFileAudioFill } from 'react-icons/pi';

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
