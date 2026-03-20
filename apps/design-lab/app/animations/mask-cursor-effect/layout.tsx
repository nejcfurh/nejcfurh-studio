import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mask Cursor Effect',
  description: 'Mask Cursor Effect component'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
