import { AnimatedDiv, AnimatedText } from '@repo/ui/animation/core';
import Link from 'next/link';

const Footer = ({ year }: { year: number }) => {
  return (
    <AnimatedDiv className="my-8 text-center">
      <AnimatedText className="text-sm text-gray-500 dark:text-gray-500">
        Built by{' '}
        <Link
          href="https://nejcfurh.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-100 cursor-pointer transition-all duration-300 ease-out hover:text-blue-300"
        >
          Nejc Furh
        </Link>
        , {year} - Inspired by numerous other talented developers. Images from
        Unsplash.
      </AnimatedText>
    </AnimatedDiv>
  );
};

export default Footer;
