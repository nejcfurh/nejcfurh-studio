'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { GoDotFill } from 'react-icons/go';

import HeaderLink from './HeaderLink';

const DomeraHeader = (): React.ReactNode => {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-gray-300 bg-gray-50 px-12 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-12">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo/domera-logo.png"
            alt="Domera"
            width={40}
            height={40}
            className="h-auto object-contain"
          />
          <span className="flex items-baseline font-sans text-[2.5rem] font-light text-[#BF9D61]">
            omera
            <span className="font-mono text-2xl font-bold text-black">
              <GoDotFill className="mt-2 inline-block size-3.5 p-0" />
            </span>
          </span>
        </Link>
      </div>
      <div className="flex h-16 items-center justify-center gap-6 px-12 font-sans text-lg font-medium text-gray-400">
        <HeaderLink href="/">Home</HeaderLink>
        <HeaderLink href="/offers">Offers</HeaderLink>
        {!loading &&
          (user ? (
            <Link
              href="/profile"
              aria-label={user.displayName ?? user.email ?? 'Profile'}
              title={user.displayName ?? user.email ?? 'Profile'}
              className="mt-1 flex size-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 bg-white text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700"
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
          ))}
      </div>
    </header>
  );
};

export default DomeraHeader;
