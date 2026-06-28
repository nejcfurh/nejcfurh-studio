'use client';

import { AnimatedDiv, AnimatedNav } from '@repo/ui/animation/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#rooms', label: 'Rooms' },
  { href: '#contact', label: 'Contact' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatedNav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 sm:px-10"
    >
      <AnimatedDiv
        aria-hidden
        initial={false}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 -z-10 border-b border-white/10 bg-[#0a0a0f]/20 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md"
      />

      <Link
        href="/"
        className="text-2xl font-light tracking-[0.3em] text-[#d4a954] uppercase"
      >
        Elysantium
      </Link>
      <div className="flex items-center gap-10">
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="hidden text-sm tracking-widest text-white/70 uppercase transition-colors hover:text-[#d4a954] sm:inline"
          >
            {label}
          </a>
        ))}
        <Link
          href="/admin-login"
          className="border border-[#d4a954]/40 px-5 py-2 text-sm tracking-widest text-[#d4a954] uppercase transition-all hover:border-[#d4a954] hover:bg-[#d4a954]/10"
        >
          Staff
        </Link>
      </div>
    </AnimatedNav>
  );
}
