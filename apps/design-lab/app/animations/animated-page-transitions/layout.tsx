import PageTransitions from '@/features/animated-page-transitions/components/PageTransitions';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Animated Page Transitions | Design Lab',
  description: 'Curve and stairs page transitions for the Next.js App Router.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <PageTransitions>{children}</PageTransitions>;
}
