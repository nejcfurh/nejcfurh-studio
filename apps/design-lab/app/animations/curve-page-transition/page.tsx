import {
  CURVE_BASE,
  glowBackground,
  ROUTE_COLORS
} from '@/features/curve-page-transition/constants';

export default function Page() {
  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center text-white"
      style={{ background: glowBackground(ROUTE_COLORS[CURVE_BASE]) }}
    >
      <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl">
        Home
      </h1>
      <p className="mt-6 max-w-md text-balance text-white/60">
        A curved SVG wipe covers the screen on navigation, then peels away to
        reveal the next page. Use the menu above to switch pages.
      </p>
    </section>
  );
}
