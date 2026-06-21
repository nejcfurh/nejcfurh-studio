import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curved Menu | Design Lab',
  description: 'Curved Menu example.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
