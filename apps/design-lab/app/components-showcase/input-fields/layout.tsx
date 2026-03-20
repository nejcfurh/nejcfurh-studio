import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Text Input Fields',
  description: 'Text input fields component'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
