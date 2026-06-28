'use client';

import { AnimatedText } from '@repo/ui/animation/core';
import { ArrowUp, Github, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { JSX } from 'react';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/nejcfurh',
    icon: <Github size={18} />
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nejcfurh/',
    icon: <Linkedin size={18} />
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/nejcfurh/',
    icon: <Instagram size={18} />
  }
];

const Footer = (): JSX.Element => {
  return (
    <footer className="relative border-t border-(--divider) py-12">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <AnimatedText
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-secondary text-sm"
          >
            &copy; {new Date().getFullYear()} Nejc Furh. All rights reserved.
          </AnimatedText>

          <div className="flex items-center gap-4">
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

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="social-link hover:bg-accent! hover:text-white!"
              aria-label="Scroll to top"
            >
              <ArrowUp size={18} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
