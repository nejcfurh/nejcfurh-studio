'use client';

import supabase from '@/lib/supabase';
import { Loader2, LogIn, Upload } from 'lucide-react';
import { useState } from 'react';

const MIN_WIDTH = 700;
const MIN_HEIGHT = 700;

interface UploadImageProps {
  onCloseModal: () => void;
  onImageUpload: (url: string) => void;
  bucket?: string;
  title?: string;
}

export default function UploadImage({
  onCloseModal,
  onImageUpload,
  bucket = 'card-images',
  title = 'Upload a background image ...'
}: UploadImageProps) {
  const [fileInfo, setFileInfo] = useState('No Files Selected');
  const [previewSrc, setPreviewSrc] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [dropzoneOver, setDropzoneOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const validateImageDimensions = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new window.Image();
      img.src = e.target?.result as string;

      img.onload = () => {
        if (img.width >= MIN_WIDTH && img.height >= MIN_HEIGHT) {
          setFileInfo(`${file.name}, ${Math.round(file.size / 1024)} KB`);
          setPreviewSrc(e.target?.result as string);
          setAlertMessage('');
          setSelectedFile(file);
        } else {
          setAlertMessage(
            `Image dimensions must be at least ${MIN_WIDTH}x${MIN_HEIGHT} pixels.`
          );
        }
      };
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateImageDimensions(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) validateImageDimensions(file);
    setDropzoneOver(false);
  };

  const handleReset = () => {
    setFileInfo('No Files Selected');
    setPreviewSrc('');
    setAlertMessage('');
    setSelectedFile(null);
    if (!previewSrc) onCloseModal();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setAlertMessage('No file selected!');
      return;
    }

    setLoading(true);

    const fileExt = selectedFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, selectedFile);

    if (error) {
      setAlertMessage('Failed to upload image!');
      console.error('Error uploading file:', error.message);
    } else {
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onImageUpload(data.publicUrl);
      onCloseModal();
    }
    setLoading(false);
  };

  return (
    <form
      onReset={handleReset}
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col justify-center rounded-xl p-10"
      style={{
        width: '44rem',
        boxShadow: '0px 0px 20px 12px rgba(255, 254, 254, 0.2)',
        background: '#111111'
      }}
    >
      <h2 className="mt-0 mb-3 flex items-center justify-between text-2xl font-extralight text-white">
        <div>{title}</div>
        <span
          className="cursor-pointer opacity-80 transition-opacity hover:opacity-40"
          onClick={onCloseModal}
        >
          <LogIn size={24} />
        </span>
      </h2>
      <h5 className="mt-0 mb-8 text-base font-extralight text-gray-400">
        Drag & drop the image into the area, or click on the icon below!
      </h5>
      <div className="flex flex-row justify-between transition-all duration-500">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDropzoneOver(true);
          }}
          onDragLeave={() => setDropzoneOver(false)}
          onDrop={handleDrop}
          className={`relative flex min-h-16 w-full cursor-pointer flex-row items-center justify-center rounded-2xl border-2 border-dashed border-white p-4 text-center transition-all duration-300 ${
            dropzoneOver ? 'bg-white/10' : ''
          }`}
        >
          <div className="mr-5">
            <Upload size={48} stroke="white" />
          </div>
          <input
            type="file"
            required
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <p className="text-xl font-extralight text-white">{fileInfo}</p>
        </div>
        {previewSrc && (
          <div className="bg-surface ml-4 flex items-center justify-center rounded-2xl border-2 border-dashed border-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Preview"
              className="max-h-24 max-w-24 rounded-2xl p-4"
            />
          </div>
        )}
      </div>
      {alertMessage && (
        <div className="mt-4 w-full rounded-lg border border-red-300 bg-red-100 p-4 text-center text-red-500">
          {alertMessage}
        </div>
      )}
      <div className="mt-8 flex flex-wrap justify-between gap-4">
        <button
          type="reset"
          className="flex-1 cursor-pointer rounded-3xl border border-gray-700 px-8 py-4 text-lg font-light text-white uppercase transition-all hover:opacity-80"
          style={{ background: '#63636355' }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleUpload}
          className="flex-1 cursor-pointer rounded-3xl border border-gray-700 px-8 py-4 text-lg font-light text-white uppercase transition-all hover:opacity-80"
          style={{ background: '#2b2a2a' }}
        >
          {!loading ? (
            'Upload'
          ) : (
            <Loader2 className="inline animate-spin" size={16} />
          )}
        </button>
      </div>
    </form>
  );
}
