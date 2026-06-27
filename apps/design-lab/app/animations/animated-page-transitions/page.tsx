import {
  BASE,
  glowBackground,
  ROUTE_COLORS
} from '@/features/animated-page-transitions/constants';

export default function Page() {
  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center text-white"
      style={{ background: glowBackground(ROUTE_COLORS[BASE]) }}
    >
      <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl">
        Home
      </h1>
      <p className="mt-6 max-w-md text-balance text-white/60">
        Pick a transition style top-right, then use the menu to switch pages —
        the curve wipe or the staircase columns play on every navigation.
      </p>
    </section>
  );
}
