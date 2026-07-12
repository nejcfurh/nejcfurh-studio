import ReactLenis from '@repo/ui/animation/lenis';

export default function TeslaLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactLenis root options={{ lerp: 0.05 }}>
      {children}
    </ReactLenis>
  );
}
