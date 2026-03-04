'use client';

import Modal from '@/components/Modal';
import UploadImage from '@/components/UploadImage';
import { addCard } from '@/lib/actions/todos';
import type { IList } from '@/lib/models/user';
import { truncateUrl } from '@/lib/utils/helpers';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddCustomListProps {
  setDaily: React.Dispatch<React.SetStateAction<string>>;
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
}

export default function AddCustomList({
  setDaily,
  setLists
}: AddCustomListProps) {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [listName, setListName] = useState('');
  const [listImg, setListImg] = useState('');
  const [listBody, setListBody] = useState('');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaily(event.target.id);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const updatedLists = await addCard({
        listName,
        listImg,
        listBody
      });
      setLists(updatedLists);
      setDaily(listName);
      setListBody('');
      setListImg('');
      setListName('');
      toast.success('List created successfully!');
    } catch {
      toast.error('Failed to create list!');
    }
  };

  const handleImageUpload = (url: string) => {
    setListImg(url);
  };

  const closeModal = () => setIsOpenModal(false);

  return (
    <>
      <input
        type="radio"
        name="slide"
        id="addList"
        onChange={handleRadioChange}
      />
      <label htmlFor="addList" className="card">
        <div className="form-title-flex">
          <div className="title-div-add">
            <h4 className="title-add">ADD A CUSTOM LIST</h4>
          </div>
          <div className="card-form">
            <form className="card-item" onSubmit={handleSubmit}>
              <input
                className="input-add-card-text"
                type="text"
                name="listName"
                placeholder="Name"
                autoComplete="off"
                required
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              />
              <br />
              <div className="input-upload">
                <input
                  className="input-add-card-url"
                  type="url"
                  name="listImg"
                  placeholder="Image (url)"
                  autoComplete="off"
                  required
                  value={truncateUrl(listImg)}
                  onChange={(e) => setListImg(e.target.value)}
                />
                <Upload
                  className="upload-icon"
                  onClick={() => setIsOpenModal(!isOpenModal)}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <br />
              <input
                className="input-add-card-text"
                type="text"
                name="listBody"
                placeholder="Description"
                autoComplete="off"
                value={listBody}
                onChange={(e) => setListBody(e.target.value)}
              />
              <br />
              <button className="button-add-list" type="submit">
                Add List
              </button>
            </form>
          </div>
        </div>
        <div className="row-add">
          <div className="description-add">
            <p>You can add additional lists here!</p>
          </div>
        </div>
        <Modal open={isOpenModal} onClose={closeModal}>
          <UploadImage
            onCloseModal={closeModal}
            onImageUpload={handleImageUpload}
          />
        </Modal>
      </label>
    </>
  );
}
