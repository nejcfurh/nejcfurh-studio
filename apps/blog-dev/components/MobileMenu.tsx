'use client';

import Logo from '@/components/Logo';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { LogOut, X } from '@repo/ui/icons/lucide';
import {
  FiGithub,
  FiInstagram,
  FiLinkedin
} from '@repo/ui/icons/react-icons/fi';
import Link from 'next/link';
import { JSX } from 'react';

import MobileMenuCurve from './MobileMenuCurve';
import MobileNavLink from './MobileNavLink';

const EASE = [0.76, 0, 0.24, 1] as const;

const menuSlide = {
  initial: { x: 'calc(100% + 100px)' },
  enter: { x: '0', transition: { duration: 0.8, ease: EASE } },
  exit: { x: 'calc(100% + 100px)', transition: { duration: 0.8, ease: EASE } }
};

// SAME SOCIAL SET AS THE FOOTER.
const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/nejcfurh',
    icon: <FiGithub size={18} />
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nejcfurh/',
    icon: <FiLinkedin size={18} />
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/nejcfurh/',
    icon: <FiInstagram size={18} />
  }
];

interface MobileMenuProps {
  onClose: () => void;
  isAuthed: boolean;
  logoutAction: () => Promise<void>;
}

const MobileMenu = ({
  onClose,
  isAuthed,
  logoutAction
}: MobileMenuProps): JSX.Element => {
  // HOME + ARCHIVE + THE AUTH LINK, ALL IN THE SAME NAV AREA.
  // ARCHIVE ANCHOR SCROLLS TO THE LATEST-POSTS SECTION FROM ANY PAGE.
  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Archive', href: '/#archive' },
    isAuthed
      ? { title: 'Write', href: '/compose', variant: 'accent' as const }
      : { title: 'Login', href: '/login', variant: 'accent' as const }
  ];

  return (
    <AnimatedDiv
      variants={menuSlide}
      initial="initial"
      animate="enter"
      exit="exit"
      className="bg-primary text-white-100 fixed top-0 right-0 z-150 h-dvh w-full overflow-visible md:hidden"
    >
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="text-white-100 absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-(--chip-bg-hover)"
      >
        <X size={24} />
      </button>

      <div className="box-border flex h-full flex-col px-8 py-24">
        <div className="flex min-h-0 flex-1 flex-col items-center gap-3 text-center">
          {/* Logo replaces the "Navigation" label — returns to the main site. */}
          <div className="flex shrink-0 justify-center">
            <a
              href="https://nejcfurh.dev"
              onClick={onClose}
              aria-label="nejcfurh.dev"
              className="inline-flex"
            >
              <Logo className="h-auto w-[130px]" />
            </a>
          </div>

          <div className="h-px w-full shrink-0 bg-(--divider)" />

          {/* Nav links — Home, Archive, Login/Write */}
          <nav
            className="flex min-h-0 flex-1 flex-col items-center justify-evenly"
            style={{
              fontSize: `clamp(1.75rem, calc((100vh - 16rem) / ${navLinks.length} * 0.55), 3rem)`
            }}
          >
            {navLinks.map((link, index) => (
              <MobileNavLink
                key={link.href}
                data={{ ...link, index }}
                onNavigate={onClose}
              />
            ))}
          </nav>

          <div className="h-px w-full shrink-0 bg-(--divider)" />

          {/* Social links — same set as the footer (+ log out when signed in) */}
          <div className="flex w-full shrink-0 items-center justify-center gap-3 pt-1">
            {socialLinks.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="social-link"
              >
                {social.icon}
              </Link>
            ))}

            {isAuthed && (
              <form action={logoutAction}>
                <button
                  type="submit"
                  aria-label="Log out"
                  className="social-link hover:bg-accent! hover:text-white!"
                >
                  <LogOut size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <MobileMenuCurve />
    </AnimatedDiv>
  );
};

export default MobileMenu;
