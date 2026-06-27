import {
  BASE,
  glowBackground,
  ROUTE_COLORS
} from '@/features/animated-page-transitions/constants';

export default function Page() {
  return (
    <section
      className="flex min-h-screen flex-col items-center justify-center px-6 text-center text-white"
      style={{ background: glowBackground(ROUTE_COLORS[`${BASE}/contact`]) }}
    >
      <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl">
        Contact
      </h1>
      <p className="mt-6 max-w-md text-balance text-white/60">
        FrozenRouter holds the outgoing page in place during its exit, so the
        old content doesn&apos;t flicker to the new one mid-transition.
      </p>
    </section>
  );
}
