'use client';

import { CheckCircle, ListTodo, Pencil } from 'lucide-react';
import { useState } from 'react';

interface MultiOptionMenuProps {
  activeTasks: boolean;
  setActiveTasks: React.Dispatch<React.SetStateAction<boolean>>;
  modalOpen: () => void;
}

export default function MultiOptionMenu({
  activeTasks,
  setActiveTasks,
  modalOpen
}: MultiOptionMenuProps) {
  const [isVisible, setIsVisible] = useState(false);

  const stopLabel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="wrapper-menu"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onClick={stopLabel}
    >
      <div className="popup-menu">
        <div className="linee linee1"></div>
        <div className="linee linee2"></div>
        <div className="linee linee3"></div>
      </div>
      <div
        className={`nav-items items1 ${isVisible ? 'show-menu' : ''}`}
        onClick={() => setActiveTasks(!activeTasks)}
      >
        {!activeTasks ? <ListTodo size={18} /> : <CheckCircle size={18} />}
      </div>
      <div
        className={`nav-items items2 ${isVisible ? 'show-menu' : ''}`}
        onClick={modalOpen}
      >
        <Pencil size={18} />
      </div>
    </div>
  );
}
