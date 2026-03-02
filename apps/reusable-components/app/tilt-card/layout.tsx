import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Tilt Card | Reusable Components',
  description: 'Interactive 3D tilt card that responds to mouse movement',
};

export default function TiltCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
