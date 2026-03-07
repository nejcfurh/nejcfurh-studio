'use client';

import useOutsideClick from '@/lib/hooks/useOutsideClick';
import React, {
  cloneElement,
  createContext,
  useContext,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import { HiXMark } from 'react-icons/hi2';

interface ModalContextValue {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

const ModalContext = createContext<ModalContextValue>({} as ModalContextValue);

interface ModalProps {
  children: React.ReactNode;
}

function Modal({ children }: ModalProps) {
  const [openName, setOpenName] = useState('');
  const close = () => setOpenName('');
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

interface OpenProps {
  children: React.ReactElement<{ onClick?: () => void }>;
  opens: string;
}

function Open({ children, opens: opensWindowName }: OpenProps) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

interface WindowProps {
  children: React.ReactElement<{ onCloseModal?: () => void }>;
  name: string;
}

function Window({ children, name }: WindowProps) {
  const { openName, close } = useContext(ModalContext);

  const ref = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  return createPortal(
    // first argument is JSX
    <div className="fixed top-0 left-0 z-[1000] h-screen w-full bg-[var(--backdrop-color)] backdrop-blur-[4px] transition-all duration-500">
      <div
        ref={ref}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[var(--border-radius-lg)] bg-[var(--color-grey-0)] px-10 py-8 shadow-[var(--shadow-lg)] transition-all duration-500"
      >
        <button
          onClick={close}
          className="absolute top-3 right-[1.9rem] translate-x-2 rounded-[var(--border-radius-sm)] border-none bg-transparent p-1 transition-all duration-200 hover:bg-[var(--color-grey-100)] [&_svg]:h-6 [&_svg]:w-6 [&_svg]:text-[var(--color-grey-500)]"
        >
          <HiXMark />
        </button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </div>
    </div>,
    //second argument is a html node
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
