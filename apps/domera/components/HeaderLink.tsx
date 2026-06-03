'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HeaderLink = ({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const pathMatchRoute = (route: string) => pathname === route;

  return (
    <Link
      href={href}
      className={`flex h-full items-center justify-center pt-3 text-base font-semibold ${pathMatchRoute(href) ? 'border-b-4 border-[#BF9D61] text-black' : 'border-b-4 border-transparent text-gray-400'}`}
    >
      {children}
    </Link>
  );
};

export default HeaderLink;
