import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Drag & Drop',
  description: 'Drag & Drop component'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
