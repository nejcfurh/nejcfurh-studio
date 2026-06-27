import CurveTransition from '@/features/curve-page-transition/components/CurveTransition';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Curve Page Transition | Design Lab',
  description: 'Curve seamless page transition example.'
};

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <CurveTransition>{children}</CurveTransition>;
}
