'use client';

import useOutsideClick from '@/lib/hooks/useOutsideClick';
import React, { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiEllipsisVertical } from 'react-icons/hi2';

interface Position {
  x: number;
  y: number;
}

interface MenusContextValue {
  openId: string;
  open: (id: string) => void;
  close: () => void;
  position: Position | null;
  setPosition: React.Dispatch<React.SetStateAction<Position | null>>;
}

const MenusContext = createContext<MenusContextValue>({} as MenusContextValue);

interface MenusProps {
  children: React.ReactNode;
}

function Menus({ children }: MenusProps) {
  const [openId, setOpenId] = useState('');
  const [position, setPosition] = useState<Position | null>(null);

  const close = () => setOpenId('');
  const open = setOpenId;

  return (
    <MenusContext.Provider
      value={{ openId, open, close, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Menu({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-end">{children}</div>;
}

interface ToggleProps {
  id: string;
}

function Toggle({ id }: ToggleProps) {
  const { openId, close, open, setPosition } = useContext(MenusContext);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const rect = (e.target as HTMLElement)
      .closest('button')!
      .getBoundingClientRect();
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8
    });

    if (openId === '' || openId !== id) {
      open(id);
    } else {
      close();
    }
  }

  return (
    <button
      onClick={handleClick}
      className="translate-x-2 rounded-[var(--border-radius-sm)] border-none bg-transparent p-1 transition-all duration-200 hover:bg-[var(--color-grey-100)] [&_svg]:h-6 [&_svg]:w-6 [&_svg]:text-[var(--color-grey-700)]"
    >
      <HiEllipsisVertical />
    </button>
  );
}

interface ListProps {
  id: string;
  children: React.ReactNode;
}

function List({ id, children }: ListProps) {
  const { openId, position, close } = useContext(MenusContext);

  const ref = useOutsideClick<HTMLUListElement>(close, false);

  if (openId !== id) return null;

  return createPortal(
    <ul
      ref={ref}
      className="fixed rounded-[var(--border-radius-md)] bg-[var(--color-grey-0)] shadow-[var(--shadow-md)]"
      style={{ right: `${position!.x}px`, top: `${position!.y}px` }}
    >
      {children}
    </ul>,
    document.body
  );
}

interface MenuButtonProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

function Button({ children, icon, onClick, disabled }: MenuButtonProps) {
  const { close } = useContext(MenusContext);

  function handleClick() {
    onClick?.();
    close();
  }

  return (
    <li>
      <button
        disabled={disabled}
        onClick={handleClick}
        className="flex w-full items-center gap-4 border-none bg-transparent px-6 py-3 text-left text-sm transition-all duration-200 hover:bg-[var(--color-grey-50)] [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-[var(--color-grey-400)] [&_svg]:transition-all [&_svg]:duration-300"
      >
        {icon}
        <span>{children}</span>
      </button>
    </li>
  );
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
