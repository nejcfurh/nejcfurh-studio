import AnimatedDiv from './animation-core/AnimatedDiv';
import AnimatedSubTitle from './animation-core/AnimatedSubTitle';
import AnimatedTitle from './animation-core/AnimatedTitle';

const Header = ({ title }: { title: string }) => {
  return (
    <AnimatedDiv className="my-8 text-center">
      <AnimatedTitle className="bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-3xl! font-bold tracking-tight text-transparent sm:text-6xl! dark:from-white dark:to-gray-400">
        {title}
      </AnimatedTitle>
      <AnimatedSubTitle className="mx-10 mt-5 flex text-xs text-gray-500 sm:mt-8 sm:text-base">
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
