import SmoothScrollProvider from '@/features/infinite-scroll-transition/components/SmoothScrollProvider';
import type { Metadata } from 'next';

import './style.css';

export const metadata: Metadata = {
  title: 'Infinite Scroll Transition | Design Lab',
  description: 'Infinite Scroll Transition example.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
