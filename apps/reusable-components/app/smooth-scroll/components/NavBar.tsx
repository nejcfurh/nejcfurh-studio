'use client';

import { FiArrowRight } from 'react-icons/fi';
import { SiSpacex } from 'react-icons/si';

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 text-white">
      <SiSpacex className="size-10" />
      <button
        onClick={() => {
          document
            .getElementById('launch-schedule')
            ?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="flex items-center gap-2 text-sx text-zinc-400"
      >
        LAUNCH SCHEDULE <FiArrowRight />
      </button>
    </nav>
  );
};

export default NavBar;
