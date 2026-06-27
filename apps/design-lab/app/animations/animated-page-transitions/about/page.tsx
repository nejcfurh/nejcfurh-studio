import {
  BASE,
  glowBackground,
  ROUTE_COLORS
} from '@/features/animated-page-transitions/constants';

export default function Page() {
  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center text-white"
      style={{ background: glowBackground(ROUTE_COLORS[`${BASE}/about`]) }}
    >
      <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl">
        About
      </h1>
      <p className="mt-6 max-w-md text-balance text-white/60">
        Each route keeps the persistent layout mounted, so AnimatePresence can
        run the overlay&apos;s exit before the next page&apos;s enter.
      </p>
    </section>
  );
}
