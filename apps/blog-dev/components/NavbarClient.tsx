'use client';

import Logo from '@/components/Logo';
import MobileMenu from '@/components/MobileMenu';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { easeOut } from '@/utils/motion';
import { AnimatePresence } from '@repo/ui/animation';
import { AnimatedDiv, AnimatedNav } from '@repo/ui/animation/core';
import { LogOut, MenuIcon, PenLine } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { JSX, useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

// SSR-SAFE MOUNT GUARD FOR THE PORTAL: false on the server, true once on the
// client — without calling setState inside an effect.
const emptySubscribe = (): (() => void) => () => {};

interface NavLink {
  href: string;
  label: string;
}

const baseLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/#archive', label: 'Archive' }
];

interface NavbarClientProps {
  isAuthed: boolean;
  logoutAction: () => Promise<void>;
}

const NavbarClient = ({
  isAuthed,
  logoutAction
}: NavbarClientProps): JSX.Element => {
  const [scrolled, setScrolled] = useState(false);
  const [toggle, setToggle] = useState(false);
  // ON THE HOMEPAGE, WHICH SECTION IS CURRENTLY IN VIEW ('/' OR '/#archive').
  const [activeHref, setActiveHref] = useState('/');
  const pathname = usePathname();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      // Highlight Archive once its section reaches the upper part of the
      // viewport, otherwise Home. Only relevant on the homepage.
      const archive = document.getElementById('archive');
      if (archive) {
        const inView =
          archive.getBoundingClientRect().top <= window.innerHeight * 0.4;
        setActiveHref(inView ? '/#archive' : '/');
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // LOCK BODY SCROLL WHILE THE MOBILE MENU IS OPEN.
  useEffect(() => {
    document.body.style.overflow = toggle ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [toggle]);

  const mobileMenu = (
    <AnimatePresence mode="wait">
      {toggle && (
        <>
          {/* Backdrop — dims the sliver of page left of the panel */}
          <AnimatedDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={() => setToggle(false)}
            className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm md:hidden"
          />
          <MobileMenu
            onClose={() => setToggle(false)}
            isAuthed={isAuthed}
            logoutAction={logoutAction}
          />
        </>
      )}
    </AnimatePresence>
  );

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
        <a
          href="https://nejcfurh.dev"
          className="flex items-center gap-3"
          aria-label="nejcfurh.dev"
        >
          <Logo className="h-auto w-[110px]" />
        </a>

        <div className="flex items-center gap-2 md:gap-6">
          <ul className="hidden list-none flex-row items-center gap-8 md:flex">
            {baseLinks.map((link) => {
              const isActive =
                pathname === '/'
                  ? link.href === activeHref
                  : pathname === link.href;
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

          {/* Auth actions — desktop only; on mobile they live in the menu. */}
          <div className="hidden items-center gap-2 md:flex md:gap-6">
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
          </div>

          <ThemeToggle />

          {/* Hamburger — opens the mobile menu (mobile only). */}
          <button
            className="text-white-100 flex h-7 w-7 cursor-pointer items-center justify-center md:hidden"
            onClick={() => setToggle(!toggle)}
            aria-label={toggle ? 'Close menu' : 'Open menu'}
          >
            <MenuIcon size={24} />
          </button>
        </div>
      </AnimatedDiv>

      {mounted && createPortal(mobileMenu, document.body)}
    </AnimatedNav>
  );
};

export default NavbarClient;
