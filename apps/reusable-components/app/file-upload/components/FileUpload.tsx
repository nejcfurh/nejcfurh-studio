'use client';

import { FileInfo } from '@/features/file-upload/types';
import { useRef, useState } from 'react';

import Header from './Header';
import DropzoneArea from './DropzoneArea';
import ActionButton from './ActionButton';

const FileUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File) => {
    setFileInfo({
      name: file.name,
      size: Math.round(file.size / 1024), // Convert to KB
      type: file.type || 'Unknown',
      file: file,
    });
  };

  const handleReset = () => {
    setFileInfo(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileInfo?.file) {
      console.log('Submitted file:', fileInfo.file);
      // Add your file upload logic here
      alert(`File "${fileInfo.name}" is ready to be uploaded!`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onReset={handleReset}
      className="z-50 w-full max-w-2xl rounded-2xl border border-gray-300 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl dark:border-gray-800 dark:bg-gray-900"
    >
      {/* HEADER */}
      <Header />

      {/* DROPZONE AREA */}
      <DropzoneArea
        isDragOver={isDragOver}
        handleFile={handleFile}
        setIsDragOver={setIsDragOver}
        inputRef={inputRef as React.RefObject<HTMLInputElement>}
        fileInfo={fileInfo}
      />

      {/* ACTION BUTTONS */}
      <div className="mt-8 flex gap-4">
        <ActionButton
          type="reset"
          className="group flex-1 rounded-lg border border-gray-300 bg-white px-6 py-3 text-lg font-medium text-gray-700 transition-all duration-300 hover:scale-[1.02] hover:border-gray-400 hover:bg-gray-400/50 hover:shadow-md active:scale-[0.98] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-750"
        />
        <ActionButton
          type="submit"
          className="group flex-1 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 px-6 py-3 text-lg font-medium text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:from-blue-500 disabled:hover:to-indigo-600 disabled:hover:shadow-md"
        />
      </div>
    </form>
  );
};

export default FileUpload;
