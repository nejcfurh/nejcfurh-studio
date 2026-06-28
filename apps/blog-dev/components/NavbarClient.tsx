'use client';

import Logo from '@/components/Logo';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { easeOut } from '@/utils/motion';
import { AnimatedDiv, AnimatedNav } from '@repo/ui/animation/core';
import { LogOut, PenLine } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX, useEffect, useState } from 'react';

interface NavLink {
  href: string;
  label: string;
}

const baseLinks: NavLink[] = [{ href: '/', label: 'Home' }];

interface NavbarClientProps {
  isAuthed: boolean;
  logoutAction: () => Promise<void>;
}

const NavbarClient = ({
  isAuthed,
  logoutAction
}: NavbarClientProps): JSX.Element => {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatedNav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: easeOut, delay: 1 }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
    >
      <AnimatedDiv
        layout
        transition={{ layout: { duration: 0.85, ease: easeOut } }}
        className={`pointer-events-auto flex items-center justify-between transition-[background-color,border-color,box-shadow] duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? 'bg-primary/85 w-full border-b border-(--divider) px-6 py-4 backdrop-blur-xs sm:px-8 lg:px-12 ' +
              'md:bg-primary/75 md:mt-3 md:w-auto md:max-w-[calc(100%-2rem)] md:gap-8 md:rounded-full md:border-b-transparent md:px-4 md:py-2 md:backdrop-blur-lg ' +
              'md:shadow-[inset_0_0_0_1px_var(--divider),0_8px_32px_rgba(0,0,0,0.12)]'
            : 'w-full max-w-6xl border-b border-transparent bg-transparent px-6 py-4 sm:px-8 lg:px-12'
        }`}
      >
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          <Logo className="h-auto w-[110px]" />
        </Link>

        <div className="flex items-center gap-2 md:gap-6">
          <ul className="hidden list-none flex-row items-center gap-8 md:flex">
            {baseLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm transition-colors duration-300 ${
                      isActive
                        ? 'text-white-100'
                        : 'text-secondary hover:text-white-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {isAuthed ? (
            <>
              <Link
                href="/compose"
                className="bg-accent! inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_25px_var(--accent-glow)]"
              >
                <PenLine size={15} />
                Write
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  aria-label="Log out"
                  className="text-secondary hover:text-white-100 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-(--chip-bg-hover)"
                >
                  <LogOut size={17} />
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-accent! inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-[0_0_25px_var(--accent-glow)]"
            >
              Login
            </Link>
          )}

          <ThemeToggle />
        </div>
      </AnimatedDiv>
    </AnimatedNav>
  );
};

export default NavbarClient;
