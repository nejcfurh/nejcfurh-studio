'use client';

import { JSX, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { logo } from '@/public';
import { navLinks } from '../constants';
import { MenuIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = (): JSX.Element => {
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full flex items-center py-4 fixed top-0 z-50 transition-all duration-500 ${
        scrolled ? 'nav-glass' : 'bg-transparent'
      }`}
    >
      <div className="w-full flex justify-between items-center max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => {
            setActive('');
            window.scrollTo(0, 0);
          }}
        >
          <Image
            src={logo}
            alt="logo"
            className="w-[120px] object-contain"
            priority
          />
        </Link>

        <ul className="list-none hidden md:flex flex-row gap-8 items-center">
          {navLinks.map(link => {
            const isContact = link.id === 'contact';
            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setActive(link.title)}
                  className={
                    isContact
                      ? 'magnetic-btn !py-2 !px-5 !text-sm'
                      : `text-sm transition-colors duration-300 ${
                          active === link.title
                            ? 'text-white-100'
                            : 'text-secondary hover:text-white-100'
                        }`
                  }
                >
                  {link.title}
                </a>
              </li>
            );
          })}
        </ul>

        <button
          className="md:hidden w-7 h-7 flex items-center justify-center cursor-pointer z-[60] text-white-100"
          onClick={() => setToggle(!toggle)}
          aria-label={toggle ? 'Close menu' : 'Open menu'}
        >
          {toggle ? <X size={24} /> : <MenuIcon size={24} />}
        </button>

        <AnimatePresence>
          {toggle && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-primary/95 backdrop-blur-xl z-[55] flex items-center justify-center"
            >
              <nav>
                <ul className="list-none flex flex-col items-center gap-12">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                    >
                      <a
                        href={`#${link.id}`}
                        className={`text-4xl font-light transition-colors duration-300 ${
                          active === link.title
                            ? 'text-white-100'
                            : 'text-secondary hover:text-white-100'
                        }`}
                        onClick={() => {
                          setActive(link.title);
                          setToggle(false);
                        }}
                      >
                        {link.title}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
