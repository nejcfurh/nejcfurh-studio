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
      <div className="grid h-screen grid-cols-[26rem_1fr] grid-rows-[auto_1fr]">
        <Header />
        <Sidebar />
        <main className="overflow-auto bg-[var(--color-grey-50)] px-12 pt-10 pb-16">
          <div className="mx-auto flex max-w-[120rem] flex-col gap-9">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}

export default AppLayout;
