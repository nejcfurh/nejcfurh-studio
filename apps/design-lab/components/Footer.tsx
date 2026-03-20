import { AnimatedDiv, AnimatedText } from '@repo/ui/animation/core';

const Footer = ({ year }: { year: number }) => {
  return (
    <AnimatedDiv className="my-8 text-center">
      <AnimatedText className="text-sm text-gray-500 dark:text-gray-500">
        Built by Nejc Furh, {year} - Inspired by numerous other talented
        developers.
      </AnimatedText>
    </AnimatedDiv>
  );
};

export default Footer;
