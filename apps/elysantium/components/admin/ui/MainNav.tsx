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
                title={label}
                className={`flex items-center gap-4 rounded-(--border-radius-sm) px-3 py-3 text-base font-medium text-(--color-grey-600) no-underline transition-colors duration-200 hover:bg-(--color-grey-50) hover:text-(--color-grey-800) [&_svg]:h-6 [&_svg]:w-6 [&_svg]:shrink-0 [&_svg]:text-(--color-grey-400) [&_svg]:transition-colors [&_svg]:duration-200 hover:[&_svg]:text-(--color-brand-600) ${
                  isActive
                    ? 'bg-(--color-grey-50) text-(--color-grey-800) [&_svg]:text-(--color-brand-600)!'
                    : ''
                }`}
              >
                <Icon />
                <span className="whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/sidebar:opacity-100 motion-reduce:transition-none">
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default MainNav;
