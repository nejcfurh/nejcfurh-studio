'use client';

import UserAvatar from '@/components/admin/features/authentication/UserAvatar';
import HeaderMenu from '@/components/admin/ui/HeaderMenu';

function Header() {
  return (
    <header className="flex items-center justify-end gap-6 border-b border-[var(--color-grey-100)] bg-[var(--color-grey-0)] px-12 py-3">
      <UserAvatar />
      <HeaderMenu />
    </header>
  );
}

export default Header;
