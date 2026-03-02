import { FileInfo } from '@/features/file-upload/types';
import { getFileIcon } from '@/features/file-upload/utils';
import { FiFile, FiUploadCloud } from 'react-icons/fi';

interface DropzoneAreaProps {
  isDragOver: boolean;
  handleFile: (file: File) => void;
  setIsDragOver: (isDragOver: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement> | null;
  fileInfo: FileInfo | null;
}

const DropzoneArea = ({
  isDragOver,
  handleFile,
  setIsDragOver,
  inputRef,
  fileInfo,
}: DropzoneAreaProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnd={handleDragEnd}
      onDrop={handleDrop}
      className={`group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-300 ${
        isDragOver
          ? 'scale-[1.02] border-blue-500 bg-blue-50 shadow-lg dark:border-blue-400 dark:bg-blue-950/20'
          : 'border-gray-300 bg-gray-50 hover:scale-[1.01] hover:border-blue-400 hover:bg-gray-400/50 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-gray-750'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        required
        id="upload-file"
        name="uploaded-file"
        onChange={handleFileChange}
        className="absolute inset-0 cursor-pointer opacity-0"
      />

      {!fileInfo ? (
        <>
          <FiUploadCloud className="mb-4 h-16 w-16 text-gray-400 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-500 dark:text-gray-500 dark:group-hover:text-blue-400" />
          <p className="text-center text-lg font-medium text-gray-700 transition-colors duration-300 group-hover:text-gray-900 dark:text-gray-300 dark:group-hover:text-white">
            No Files Selected
          </p>
          <p className="mt-2 text-center text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300">
            Click to browse or drag and drop
          </p>
        </>
      ) : (
        <div className="flex w-full items-center gap-4 rounded-lg bg-white p-4 border border-gray-300 transition-all duration-300 hover:shadow-md dark:bg-gray-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-500 text-2xl transition-transform duration-300 hover:scale-110 hover:rotate-6">
            {getFileIcon(fileInfo.type)}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {fileInfo.name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {fileInfo.size} KB • {fileInfo.type || 'Unknown type'}
            </p>
          </div>
          <FiFile className="h-6 w-6 text-gray-400 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-500" />
        </div>
      )}
    </div>
  );
};

export default DropzoneArea;
