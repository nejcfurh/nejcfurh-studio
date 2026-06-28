'use client';

import Header from '@/components/admin/ui/Header';
import Sidebar from '@/components/admin/ui/Sidebar';
import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <div className="grid h-screen grid-cols-[5rem_1fr] grid-rows-[auto_1fr]">
        <Sidebar />
        <Header />
        <main
          className="col-start-2 row-start-2 overflow-auto bg-(--color-grey-50) px-12 pt-10 pb-16"
          style={{
            backgroundImage:
              'radial-gradient(48rem 32rem at 100% 0%, color-mix(in srgb, var(--color-brand-500) 7%, transparent), transparent 70%)',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: 'local'
          }}
        >
          <div className="mx-auto flex max-w-480 flex-col gap-9">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

export default AppLayout;
