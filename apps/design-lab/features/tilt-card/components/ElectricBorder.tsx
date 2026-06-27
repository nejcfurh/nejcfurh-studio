export default function ElectricBorder() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {/* WOBBLING CORE BORDER */}
      <div className="absolute inset-0 rounded-2xl border-2 border-(--electric-border-color) filter-[url(#turbulent-displace)]" />
      {/* INNER GLOW */}
      <div className="absolute inset-0 rounded-2xl border-2 border-[rgba(221,132,72,0.6)] blur-[1px]" />
      {/* OUTER GLOW */}
      <div className="absolute inset-0 rounded-2xl border-2 border-(--electric-light-color) blur-xs" />
      {/* BACKGROUND GRADIENT GLOW */}
      <div className="absolute inset-0 scale-110 rounded-2xl opacity-20 mix-blend-overlay blur-2xl [background:linear-gradient(-30deg,var(--electric-light-color),transparent_30%,transparent_70%,var(--electric-light-color))]" />
      <div className="absolute inset-0 scale-110 rounded-2xl opacity-10 mix-blend-overlay blur-2xl [background:linear-gradient(-30deg,var(--electric-light-color),transparent_30%,transparent_70%,var(--electric-light-color))]" />
    </div>
  );
}
