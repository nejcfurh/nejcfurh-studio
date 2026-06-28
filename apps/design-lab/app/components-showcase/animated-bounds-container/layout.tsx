import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Animated Bounds Container | Design Lab',
  description:
    'Animated bounds container component which animates the bounds of a container based on the content.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
