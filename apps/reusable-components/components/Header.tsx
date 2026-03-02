import AnimatedDiv from './animation-core/AnimatedDiv';
import AnimatedSubTitle from './animation-core/AnimatedSubTitle';
import AnimatedTitle from './animation-core/AnimatedTitle';

const Header = ({ title }: { title: string }) => {
  return (
    <AnimatedDiv className="my-8 text-center">
      <AnimatedTitle className="bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-3xl! sm:text-6xl! font-bold tracking-tight text-transparent">
        {title}
      </AnimatedTitle>
      <AnimatedSubTitle className="flex mt-5 sm:mt-8 text-gray-500 text-xs sm:text-base mx-10">
        <span>
          A collection of reusable components for your next project, check it
          out on{' '}
          <a
            href="https://github.com/nejcfurh/reusable-components"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-gray-200"
          >
            Github.
          </a>{' '}
          <span className="sm:hidden">
            Previews are available on desktop page.
          </span>
        </span>
      </AnimatedSubTitle>
    </AnimatedDiv>
  );
};

export default Header;
