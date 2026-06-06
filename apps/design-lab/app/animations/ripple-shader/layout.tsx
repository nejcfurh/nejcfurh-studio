import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ripple Shader | Design Lab',
  description: 'Ripple shader animation.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
