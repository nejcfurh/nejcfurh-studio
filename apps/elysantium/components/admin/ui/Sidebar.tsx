'use client';

import Logo from '@/components/admin/ui/Logo';
import MainNav from '@/components/admin/ui/MainNav';
import Uploader from '@/lib/data/Uploader';

function Sidebar() {
  return (
    <aside className="row-span-full flex flex-col gap-8 border-r border-[var(--color-grey-100)] bg-[var(--color-grey-0)] px-6 py-8">
      <Logo />
      <MainNav />
      {process.env.NODE_ENV === 'development' && <Uploader />}
    </aside>
  );
}

export default Sidebar;
