'use client';

import { AnimatedDiv } from '@repo/ui/animation/core';
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter
} from 'react-icons/fa6';

import MagneticEffect from './MagneticEffect';

const MAGNETIC_BUTTONS_DATA = [
  {
    id: 1,
    icon: <FaFacebookF className="size-20 text-white" />
  },
  {
    id: 2,
    icon: <FaTwitter className="size-20 text-white" />
  },
  {
    id: 3,
    icon: <FaInstagram className="size-20 text-white" />
  },
  {
    id: 4,
    icon: <FaLinkedin className="size-20 text-white" />
  },
  {
    id: 5,
    icon: <FaGithub className="size-20 text-white" />
  }
];

const MagneticButtons = () => {
  return (
    <div className="z-50 mb-[40vh] flex flex-wrap items-center justify-center gap-10 px-4 sm:gap-20">
      {MAGNETIC_BUTTONS_DATA.map((button) => (
        <AnimatedDiv
          key={button.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex cursor-pointer items-center justify-center"
        >
          <MagneticEffect>{button.icon}</MagneticEffect>
        </AnimatedDiv>
      ))}
    </div>
  );
};

export default MagneticButtons;
