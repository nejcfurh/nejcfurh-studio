import { AnimatedDiv, AnimatedTitle } from '@repo/ui/animation/core';

const Header = ({ title }: { title: string }) => {
  return (
    <AnimatedDiv className="mt-8 text-center">
      <AnimatedTitle className="bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text py-2 text-3xl! font-bold tracking-tight text-transparent sm:text-6xl! dark:from-white dark:to-gray-400">
        {title}
      </AnimatedTitle>
    </AnimatedDiv>
  );
};

export default Header;
