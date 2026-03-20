import type { Metadata } from 'next';

import '@/app/globals.css';
import './scroll-to-unblur.css';

export const metadata: Metadata = {
  title: 'Scroll to Unblur',
  description: 'Scroll to unblur component'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
