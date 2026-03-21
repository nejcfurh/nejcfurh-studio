import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Infinite Scroll Carousel',
  description: 'Infinite Scroll Carousel component'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
