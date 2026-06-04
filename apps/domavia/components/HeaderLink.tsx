'use client';

import { navItemVariants } from '@/components/header-motion';
import { motion } from '@repo/ui/animation';
import { AnimatedSpan } from '@repo/ui/animation/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MotionLink = motion.create(Link);

const HeaderLink = ({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <MotionLink
      href={href}
      variants={navItemVariants}
      className={`relative flex h-full items-center justify-center pt-2 text-base font-semibold transition-colors ${isActive ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
    >
      {children}
      {isActive ? (
        <AnimatedSpan
          layoutId="nav-underline"
          transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-[#BF9D61]"
        />
      ) : null}
    </MotionLink>
  );
};

export default HeaderLink;
