'use client';

import ButtonIcon from '@/components/admin/ui/ButtonIcon';
import { useDarkMode } from '@/lib/context/DarkModeContext';
import { HiOutlineMoon, HiOutlineSun } from '@repo/ui/icons/react-icons/hi2';

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <ButtonIcon as="div" onClick={toggleDarkMode}>
      {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
    </ButtonIcon>
  );
}

export default DarkModeToggle;
