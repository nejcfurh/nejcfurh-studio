'use client';

import '@/app/globals.css';
import SideNavigation from '@/components/SideNavigation';
import { useSession } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = useSession();

  const { isLoaded, isSignedIn } = session;

  if (isLoaded && !isSignedIn) {
    redirect('/');
  }

  return (
    <main className="container mx-auto py-12 px-12">
      <div className="flex gap-8">
        <SideNavigation />
        <div className="w-full min-h-screen">{children}</div>
      </div>
    </main>
  );
}
