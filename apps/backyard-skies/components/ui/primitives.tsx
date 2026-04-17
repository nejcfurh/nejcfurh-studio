'use client';

import { shade } from '@/lib/designTokens';
import { CSSProperties, ReactNode, useEffect, useState } from 'react';

export function GlassCard({
  children,
  style,
  strong = false,
  onClick,
  className
}: {
  children: ReactNode;
  style?: CSSProperties;
  strong?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={[
        'rounded-[22px] border border-white/10 backdrop-blur-2xl backdrop-saturate-180',
        strong ? 'bg-white/10' : 'bg-white/5',
        className ?? ''
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}

export function ArcadeButton({
  children,
  accent = '#ffd24b',
  onClick,
  secondary = false,
  type = 'button',
  style
}: {
  children: ReactNode;
  accent?: string;
  onClick?: () => void;
  secondary?: boolean;
  type?: 'button' | 'submit';
  style?: CSSProperties;
}) {
  if (secondary) {
    return (
      <button
        type={type}
        onClick={onClick}
        className="font-display flex w-full cursor-pointer items-center justify-center gap-2 rounded-[18px] border border-white/10 bg-white/10 px-5 py-4 text-[15px] font-bold tracking-[0.05em] text-white uppercase"
        style={style}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className="font-display relative flex w-full cursor-pointer items-center justify-center gap-2.5 overflow-hidden rounded-[20px] border-0 px-5 py-[18px] text-[16px] font-extrabold tracking-[0.08em] text-[#0a0a0a] uppercase"
      style={{
        background: `linear-gradient(180deg, ${accent} 0%, ${shade(accent, -15)} 100%)`,
        boxShadow: `0 10px 30px ${accent}55, inset 0 1px 0 rgba(255,255,255,0.4)`,
        ...style
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 left-0 h-1/2 rounded-t-[20px] bg-[linear-gradient(180deg,rgba(255,255,255,0.25),transparent)]"
      />
      <span className="relative flex items-center gap-2.5">{children}</span>
    </button>
  );
}

export function Aurora({
  colors = ['#3a6dff', '#ff3d7a'],
  opacity = 0.5
}: {
  colors?: [string, string] | string[];
  opacity?: number;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute -top-20 -left-14 h-[340px] w-[340px] rounded-full blur-[60px]"
        style={{
          background: `radial-gradient(circle, ${colors[0]} 0%, transparent 70%)`,
          opacity
        }}
      />
      <div
        className="absolute -right-20 -bottom-32 h-[380px] w-[380px] rounded-full blur-[70px]"
        style={{
          background: `radial-gradient(circle, ${colors[1]} 0%, transparent 70%)`,
          opacity
        }}
      />
    </div>
  );
}

export function Particles({
  count = 30,
  color = 'rgba(255,255,255,0.5)'
}: {
  count?: number;
  color?: string;
}) {
  const [dots, setDots] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      s: number;
      d: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDots(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 1 + Math.random() * 2,
        d: 3 + Math.random() * 5,
        delay: Math.random() * 5
      }))
    );
  }, [count]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.s,
            height: d.s,
            background: color,
            animation: `floatDust ${d.d}s ease-in-out ${d.delay}s infinite`,
            boxShadow: `0 0 ${d.s * 2}px ${color}`
          }}
        />
      ))}
    </div>
  );
}
