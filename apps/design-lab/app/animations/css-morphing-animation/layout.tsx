import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CSS Morphing Animation | Design Lab',
  description: 'CSS Morphing Animation example.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
