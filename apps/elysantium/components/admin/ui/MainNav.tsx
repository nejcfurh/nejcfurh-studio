'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import {
  HiOutlineCalendarDays,
  HiOutlineCog6Tooth,
  HiOutlineHome,
  HiOutlineHomeModern,
  HiOutlineUsers
} from 'react-icons/hi2';

interface NavItem {
  to: string;
  icon: IconType;
  label: string;
}

function MainNav() {
  const pathname = usePathname();
  const navItems: NavItem[] = [
    { to: '/admin/dashboard', icon: HiOutlineHome, label: 'Home' },
    { to: '/admin/bookings', icon: HiOutlineCalendarDays, label: 'Bookings' },
    { to: '/admin/cabins', icon: HiOutlineHomeModern, label: 'Cabins' },
    { to: '/admin/users', icon: HiOutlineUsers, label: 'Users' },
    { to: '/admin/settings', icon: HiOutlineCog6Tooth, label: 'Settings' }
  ];

  return (
    <nav>
      <ul className="flex flex-col gap-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = pathname.startsWith(to);
          return (
            <li key={to}>
              <Link
                href={to}
                className={`ml-[2.5rem] flex items-center gap-3 px-6 py-3 text-base font-medium text-[var(--color-grey-600)] no-underline transition-all duration-300 hover:rounded-[var(--border-radius-sm)] hover:bg-[var(--color-grey-50)] hover:text-[var(--color-grey-800)] [&_svg]:h-6 [&_svg]:w-6 [&_svg]:text-[var(--color-grey-400)] [&_svg]:transition-all [&_svg]:duration-300 hover:[&_svg]:text-[var(--color-brand-600)] ${
                  isActive
                    ? 'rounded-[var(--border-radius-sm)] bg-[var(--color-grey-50)] text-[var(--color-grey-800)] [&_svg]:!text-[var(--color-brand-600)]'
                    : ''
                }`}
              >
                <Icon />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MainNav;
