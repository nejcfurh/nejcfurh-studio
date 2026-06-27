'use client';

import { cn } from '@/utils/utils';
import { motion } from '@repo/ui/animation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { LINKS } from '../constants';

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-5 left-1/2 z-100 -translate-x-1/2">
      <ul className="flex items-center gap-1 rounded-full bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur-md">
        {LINKS.map((link) => {
          const active = pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'relative block rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300',
                  active ? 'text-black' : 'text-white/80 hover:text-white'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="page-nav-pill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
