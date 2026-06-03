import Image from 'next/image';
import Link from 'next/link';
import { GoDotFill } from 'react-icons/go';

import HeaderLink from './HeaderLink';

const HEADER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/offers', label: 'Offers' },
  { href: '/auth/login', label: 'Login' },
  { href: '/auth/register', label: 'Register' },
  { href: '/profile', label: 'Profile' }
];

const DomeraHeader = (): React.ReactNode => {
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
        {HEADER_LINKS.map((link) => (
          <HeaderLink key={link.href} href={link.href}>
            {link.label}
          </HeaderLink>
        ))}
      </div>
    </header>
  );
};

export default DomeraHeader;
