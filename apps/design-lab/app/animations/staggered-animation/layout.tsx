import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Staggered Animation | Design Lab',
  description: 'Staggered list animation component.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
