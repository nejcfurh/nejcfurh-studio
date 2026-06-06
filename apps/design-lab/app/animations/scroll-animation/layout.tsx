import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apple Scroll Effect | Design Lab',
  description: 'Apple Scroll Effect page.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
