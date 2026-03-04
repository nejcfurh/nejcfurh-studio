'use client';

import { updateCard } from '@/lib/actions/todos';
import type { IList } from '@/lib/models/user';
import supabase, { deleteImageSupabase } from '@/lib/supabase';
import { Loader2, LogIn, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface EditCardModalProps {
  list: IList;
  onClose: () => void;
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
  setDaily: React.Dispatch<React.SetStateAction<string>>;
}

export default function EditCardModal({
  onClose,
  list,
  setLists,
  setDaily
}: EditCardModalProps) {
  const { name, body, _id, url } = list;
  const [loading, setLoading] = useState(false);
  const [listName, setListName] = useState(name);
  const [listImg, setListImg] = useState(url);
  const [listBody, setListBody] = useState(body || '');
  const inputFile = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    if (listImg.includes('supabase')) {
      const imageName = listImg.split('/').pop()!;
      deleteImageSupabase(imageName);
    }
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('card-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error.message);
    } else {
      const { data } = supabase.storage
        .from('card-images')
        .getPublicUrl(fileName);
      if (data.publicUrl) {
        setListImg(data.publicUrl);
      }
    }
    setLoading(false);
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const updatedLists = await updateCard({
        listId: _id,
        listName,
        listBody,
        listImg
      });
      onClose();
      setLists(updatedLists);
      setDaily(listName);
      toast.success('List information updated!');
      if (url.includes('supabase')) {
        const imageName = url.split('/').pop()!;
        deleteImageSupabase(imageName);
      }
    } catch {
      toast.error('Failed to update card!');
    } finally {
      setLoading(false);
    }
  };

  const truncatedListImg =
    listImg.length > 38 ? `${listImg.substring(0, 38)}...` : listImg;

  return (
    <form
      onReset={handleReset}
      onSubmit={handleUpdate}
      className="flex flex-col justify-center rounded-xl p-10"
      style={{
        width: '34rem',
        boxShadow: '0px 0px 20px 12px rgba(255, 254, 254, 0.2)',
        background: '#111111'
      }}
    >
      <h2 className="mt-0 mb-3 flex items-center justify-between text-2xl font-extralight text-white">
        Update information for &quot;{name}&quot;
        <span
          className="cursor-pointer opacity-80 transition-opacity hover:opacity-40"
          onClick={onClose}
        >
          <LogIn size={24} />
        </span>
      </h2>
      <h5 className="mt-0 mb-8 text-base font-extralight text-gray-400">
        {name === 'Daily'
          ? `On the "${name}" list you can only update the background image!`
          : `Update name, image, or the subtitle of "${name}" list!`}
      </h5>
      {name !== 'Daily' && (
        <input
          className="edit-name-input"
          type="text"
          name="listName"
          placeholder="Name"
          autoComplete="off"
          required
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />
      )}
      <br />
      <div className="input-upload">
        <input
          className="edit-url-input"
          type="url"
          name="listImg"
          placeholder="Image (url)"
          autoComplete="off"
          required
          value={truncatedListImg}
          onChange={(e) => setListImg(e.target.value)}
        />
        <input
          type="file"
          ref={inputFile}
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <Upload
          className="upload-icon"
          onClick={() => inputFile.current?.click()}
        />
      </div>
      <br />
      {name !== 'Daily' && (
        <input
          className="edit-body-input"
          type="text"
          name="listBody"
          placeholder="Description"
          autoComplete="off"
          value={listBody}
          onChange={(e) => setListBody(e.target.value)}
        />
      )}
      <div className="mt-8 flex flex-wrap justify-between gap-4">
        <button
          type="reset"
          className="flex-1 cursor-pointer rounded-3xl border border-gray-700 px-8 py-4 text-lg font-extralight text-white uppercase transition-all hover:opacity-80"
          style={{ background: '#63636355' }}
          onClick={handleReset}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 cursor-pointer rounded-3xl border border-gray-700 px-8 py-4 text-lg font-extralight text-white uppercase transition-all hover:opacity-80"
          style={{ background: '#2b2a2a' }}
        >
          {!loading ? (
            'Update'
          ) : (
            <Loader2 className="inline animate-spin" size={16} />
          )}
        </button>
      </div>
    </form>
  );
}
