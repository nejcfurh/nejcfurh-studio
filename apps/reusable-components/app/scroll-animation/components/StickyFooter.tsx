import Link from 'next/link';
import { BsTwitterX } from 'react-icons/bs';
import { CgFacebook } from 'react-icons/cg';
import { SlSocialLinkedin } from 'react-icons/sl';
import { TbBrandInstagram } from 'react-icons/tb';

const footerSections = [
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Documentation', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'Licenses', href: '#' },
    ],
  },
];

const socialLinks = [
  {
    icon: <BsTwitterX className="size-6 text-black" />,
    href: '#',
    label: 'Twitter',
  },
  {
    icon: <SlSocialLinkedin className="size-6 text-black" />,
    className: 'text-black',
    href: '#',
    label: 'LinkedIn',
  },
  {
    icon: <TbBrandInstagram className="size-8 text-black" />,
    href: '#',
    label: 'Instagram',
  },
  {
    icon: <CgFacebook className="size-8 text-black" />,
    href: '#',
    label: 'Facebook',
  },
];

const bottomLinks = [
  { label: 'Status', href: '#' },
  { label: 'Sitemap', href: '#' },
];

const StickyFooter = () => {
  return (
    <footer className="bg-white text-black z-0 flex flex-col min-h-[50vh] px-8 md:px-12 lg:px-20 pt-10 pb-4 fixed bottom-0 w-full border-t border-gray-200">
      {/* MAIN FOOTER CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOP SECTION - MULTI COLUMN LAYOUT */}
        <div className="grid grid-cols-4 gap-2 sm:gap-8 md:gap-12 mb-8">
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className="text-xs sm:text-base font-semibold mb-4 text-black uppercase tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-600">
                {section.links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-black transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* COPYRIGHT & HEADING */}
      <div className="mt-auto flex flex-col gap-2">
        <div className="flex flex-row justify-between items-center gap-2 text-xs text-gray-500 border-t-2 border-gray-300 pt-1">
          <p>© 2026 - All rights reserved.</p>
          <div className="flex gap-4">
            {bottomLinks.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-black transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        {/* HEADING WITH SOCIAL ICONS */}
        <div className="flex flex-col my-5 sm:mb-0 sm:flex-row items-center justify-between gap-6">
          <h1 className="text-left text-4xl sm:text-6xl md:text-9xl font-bold whitespace-nowrap text-black">
            COMPANY NAME
          </h1>
          <div className="flex gap-5">
            {socialLinks.map(social => (
              <Link
                key={social.label}
                className="w-12 h-12 p-2 rounded-full border-2 border-gray-300 text-gray-700 flex items-center justify-center text-sm transition-all duration-200 hover:border-black hover:text-black hover:shadow-sm shadow-gray-600"
                href={social.href}
                aria-label={social.label}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default StickyFooter;
