'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { AnimatedHeader, AnimatedNav } from '@repo/ui/animation/core';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import HeaderLink from './HeaderLink';

const DomaviaHeader = (): React.ReactNode => {
  const { user, loading } = useAuth();

  return (
    <AnimatedHeader className="sticky top-0 z-50 flex h-16 items-center justify-between gap-3 border-b border-gray-300 bg-gray-50 px-4 shadow-sm sm:px-10 lg:px-50">
      <Link href="/" className="flex shrink-0 items-center">
        <Image
          src="/logo/logo.svg"
          alt="Domavia"
          width={175}
          height={175}
          className="ml-[-8] h-auto object-contain"
        />
      </Link>
      <AnimatedNav className="flex h-16 shrink-0 items-center gap-4 font-sans font-medium text-gray-400 sm:gap-6">
        <HeaderLink href="/">Home</HeaderLink>
        <HeaderLink href="/offers">Offers</HeaderLink>
        {loading ? null : user ? (
          <Link
            href="/profile"
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
          </Link>
        ) : (
          <HeaderLink href="/auth/login">Login</HeaderLink>
        )}
      </AnimatedNav>
    </AnimatedHeader>
  );
};

export default DomaviaHeader;
