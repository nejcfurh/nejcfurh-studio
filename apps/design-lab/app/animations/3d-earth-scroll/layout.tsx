import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Earth Scroll | Design Lab',
  description: '3D Earth Scroll example.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
