'use client';

import {
  navContainerVariants,
  navItemVariants
} from '@/components/header-motion';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { motion } from '@repo/ui/animation';
import { AnimatedHeader, AnimatedNav } from '@repo/ui/animation/core';
import { User } from '@repo/ui/icons/lucide';
import Image from 'next/image';
import Link from 'next/link';

import HeaderLink from './HeaderLink';

const MotionLink = motion.create(Link);

const DomaviaHeader = (): React.ReactNode => {
  const { user, loading } = useAuth();

  return (
    <AnimatedHeader
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
      className="sticky top-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-gray-300 bg-gray-50 px-4 shadow-sm sm:px-10 lg:px-50"
    >
      <Link href="/" className="flex shrink-0 items-center">
        <Image
          src="/logo/logo.svg"
          alt="Domavia"
          width={175}
          height={175}
          className="ml-[-8] h-auto object-contain"
        />
      </Link>
      <AnimatedNav
        variants={navContainerVariants}
        initial="hidden"
        animate="visible"
        className="flex h-16 shrink-0 items-center gap-4 font-sans font-medium text-gray-400 sm:gap-6"
      >
        <HeaderLink href="/">Home</HeaderLink>
        <HeaderLink href="/offers">Offers</HeaderLink>
        {loading ? null : user ? (
          <MotionLink
            href="/profile"
            variants={navItemVariants}
            aria-label={user.displayName ?? user.email ?? 'Profile'}
            title={user.displayName ?? user.email ?? 'Profile'}
            className="mt-1 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-white text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
          >
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt=""
                width={32}
                height={32}
                className="size-8 object-cover"
              />
            ) : (
              <User className="size-4" />
            )}
          </MotionLink>
        ) : (
          <HeaderLink href="/auth/login">Login</HeaderLink>
        )}
      </AnimatedNav>
    </AnimatedHeader>
  );
};

export default DomaviaHeader;
