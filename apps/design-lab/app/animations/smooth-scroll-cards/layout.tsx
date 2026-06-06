import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Smooth Scroll Cards | Design Lab',
  description: 'Smooth scroll cards component.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
