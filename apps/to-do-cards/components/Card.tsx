'use client';

import EditCardModal from '@/components/EditCardModal';
import Modal from '@/components/Modal';
import MultiOptionMenu from '@/components/MultiOptionMenu';
import Tasks from '@/components/Tasks';
import type { IList } from '@/lib/models/user';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface CardProps {
  list: IList;
  day: string;
  daily: string;
  setLists: React.Dispatch<React.SetStateAction<IList[]>>;
  setDaily: React.Dispatch<React.SetStateAction<string>>;
  handleDelete: (event: React.FormEvent, listId: string) => void;
  handleCompleteTask: (
    event: React.FormEvent | React.MouseEvent,
    listName: string,
    itemId: string
  ) => void;
}

export default function Card({
  list,
  day,
  daily,
  handleDelete,
  handleCompleteTask,
  setLists,
  setDaily
}: CardProps) {
  const [activeTasks, setActiveTasks] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { name, body, _id, url } = list;

  const handleCloseModal = () => setIsOpenModal(false);
  const handleEditButton = () => setIsOpenModal(!isOpenModal);
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaily(event.target.id);
  };

  return (
    <>
      <input
        type="radio"
        name="slide"
        id={name}
        onChange={handleRadioChange}
        checked={daily === name}
      />
      <label
        htmlFor={name}
        className="card"
        style={{ backgroundImage: `url(${url})` }}
      >
        <div className="above-title-div">
          <div className="title-div">
            <h4 className="title">{name}</h4>
          </div>
          <Tasks
            handleCompleteTask={handleCompleteTask}
            list={list}
            setDaily={setDaily}
            setLists={setLists}
            active={activeTasks}
          />
        </div>
        <div className="row">
          <div className="icon">
            <MultiOptionMenu
              activeTasks={activeTasks}
              setActiveTasks={setActiveTasks}
              modalOpen={handleEditButton}
            />
          </div>
          <div className="description">
            <p>{name === 'Daily' ? day : body}</p>
            {name !== 'Daily' && (
              <form
                className="delete-button"
                onSubmit={(e) => handleDelete(e, _id)}
              >
                <button
                  type="submit"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    paddingRight: '30px'
                  }}
                >
                  <Trash2 className="delete-icon" size={30} color="white" />
                </button>
              </form>
            )}
          </div>
        </div>
        <Modal open={isOpenModal} onClose={handleCloseModal}>
          <EditCardModal
            list={list}
            onClose={handleCloseModal}
            setLists={setLists}
            setDaily={setDaily}
          />
        </Modal>
      </label>
    </>
  );
}
