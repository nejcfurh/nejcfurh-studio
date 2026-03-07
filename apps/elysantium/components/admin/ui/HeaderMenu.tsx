'use client';

import Logout from '@/components/admin/features/authentication/Logout';
import ButtonIcon from '@/components/admin/ui/ButtonIcon';
import DarkModeToggle from '@/components/admin/ui/DarkModeToggle';
import { useRouter } from 'next/navigation';
import { HiOutlineUser } from 'react-icons/hi';

function HeaderMenu() {
  const router = useRouter();

  return (
    <ul className="flex gap-1">
      <li>
        <ButtonIcon as="div" onClick={() => router.push('/admin/account')}>
          <HiOutlineUser />
        </ButtonIcon>
      </li>
      <li>
        <Logout />
      </li>
      <li>
        <DarkModeToggle />
      </li>
    </ul>
  );
}

export default HeaderMenu;
