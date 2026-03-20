'use client';

import { TESLA_NAV_ITEMS, TESLA_SECTIONS } from '../constants';

export default function TeslaNav() {
  const scrollTo = (label: string) => {
    const section = TESLA_SECTIONS.find(
      (s) => s.title.toLowerCase() === label.toLowerCase()
    );
    if (section) {
      document
        .getElementById(section.id)
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ul className="flex space-x-2 text-sm">
      {TESLA_NAV_ITEMS.map((item) => (
        <li
          key={item}
          onClick={() => scrollTo(item)}
          className="cursor-pointer rounded-full px-3 py-1 transition-opacity duration-300 hover:opacity-60"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
