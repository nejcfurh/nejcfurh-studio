import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Perspective Transition Animation | Design Lab',
  description: 'Perspective transition animation example with React Lenis.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
