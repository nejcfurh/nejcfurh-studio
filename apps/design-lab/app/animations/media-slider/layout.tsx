import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Media Slider | Design Lab',
  description: 'Media slider component'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
