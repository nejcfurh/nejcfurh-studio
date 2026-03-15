'use client';

import { motion } from 'framer-motion';
import { JSX } from 'react';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { BsGithub, BsTwitterX } from 'react-icons/bs';
import { SlSocialLinkedin } from 'react-icons/sl';
import { TbBrandInstagram } from 'react-icons/tb';

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/nejcfurh',
    icon: <BsGithub />,
    hoverClass: 'hover:bg-[#3c3b3b]',
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nejcfurh/',
    icon: <SlSocialLinkedin />,
    hoverClass: 'hover:bg-[#0077b5]',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/nejcfurh/',
    icon: <TbBrandInstagram />,
    hoverClass:
      'hover:bg-[radial-gradient(circle_at_30%_107%,#fdf497_0%,#fdf497_5%,#fd5949_45%,#d6249f_60%,#285AEB_90%)]',
  },
  {
    name: 'X',
    href: 'https://twitter.com/nejcfurh',
    icon: <BsTwitterX />,
    hoverClass: 'hover:bg-white hover:text-black',
  },
];

const firstName = 'NEJC';
const lastName = 'FURH';

const Hero = (): JSX.Element => {
  return (
    <section
      id="hero"
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden mt-20 sm:mt-0"
    >
      {/* Gradient orb */}
      <div className="gradient-orb gradient-orb-accent w-[400px] h-[400px] hidden sm:block -bottom-[150px] -left-[150px] absolute" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 w-full flex flex-col lg:flex-row items-center lg:items-end lg:justify-between gap-12 lg:gap-8">
        {/* Left — text content */}
        <div className="flex-1 min-w-0">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-8"
          >
            <span className="text-secondary text-sm font-mono tracking-[0.2em] uppercase">
              Product Engineer & Web Developer
            </span>
          </motion.div>

          {/* Giant name */}
          <div className="overflow-hidden">
            <motion.h1
              className="text-[clamp(60px,12vw,180px)] font-bold leading-[0.85] tracking-tighter sm:ml-[-20px] text-white-100"
              aria-label="Nejc Furh"
            >
              {firstName.split('').map((char, i) => (
                <motion.span
                  key={`first-${i}`}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4 + i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1 className="text-[clamp(60px,12vw,180px)] font-bold leading-[0.85] tracking-tighter text-gradient-accent sm:ml-[-20px]">
              {lastName.split('').map((char, i) => (
                <motion.span
                  key={`last-${i}`}
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.6 + i * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-secondary text-md sm:text-lg max-w-lg leading-relaxed"
          >
            Building polished digital experiences with React, Next.js & React
            Native. Currently at <span className="text-accent">Birdbuddy</span>.
          </motion.p>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-8 flex items-center gap-4"
          >
            {socialLinks.map(social => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className={`w-11 h-11 rounded-full outline outline-white/20 bg-transparent grid place-items-center text-white-100 cursor-pointer transition-all duration-300 hover:outline-offset-[3px] ${social.hoverClass}`}
              >
                {social.icon}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Right — portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative shrink-0"
        >
          <div className="relative w-[300px] h-[400px] sm:w-[360px] sm:h-[480px] lg:w-[420px] lg:h-[560px]">
            <Image
              src="/images/portrait.jpeg"
              alt="Nejc Furh"
              fill
              className="object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 rounded-3xl"
              priority
              sizes="(max-width: 640px) 300px, (max-width: 1024px) 360px, 420px"
            />
            {/* Left fade */}
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-primary to-transparent z-10" />
            {/* Right fade */}
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary to-transparent z-10" />
            {/* Top fade */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-primary to-transparent z-10" />
            {/* Bottom fade */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary to-transparent z-10" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-secondary hover:text-white-100 transition-colors cursor-pointer"
      >
        <span className="text-xs font-mono tracking-widest uppercase">
          Scroll
        </span>
        <ArrowDown size={16} className="scroll-indicator" />
      </motion.a>
    </section>
  );
};

export default Hero;
