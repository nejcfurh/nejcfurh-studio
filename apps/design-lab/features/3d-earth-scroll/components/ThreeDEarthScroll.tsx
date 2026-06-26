import Earth from './Earth';
import Projects from './Projects';

const ThreeDEarthScroll = () => {
  return (
    <main className="relative my-[100vh] flex h-[85vw] items-center justify-center sm:h-[60vw]">
      <Earth />
      <Projects />
    </main>
  );
};

export default ThreeDEarthScroll;
