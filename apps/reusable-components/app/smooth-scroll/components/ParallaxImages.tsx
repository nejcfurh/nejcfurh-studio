import ParallaxImage from './ParallaxImage';

const ParallaxImages = () => {
  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImage
        className="mr-auto w-1/3 rounded-sm shadow-2xl shadow-zinc-900/80"
        alt="Example of landing"
        src="/images/smooth-scroll/landing.jpg"
        start={-200}
        end={200}
      />
      <ParallaxImage
        className="ml-96 w-2/3 rounded-sm shadow-2xl shadow-zinc-900/80"
        alt="Example of launch trajectory"
        src="/images/smooth-scroll/launch-trajectory.jpg"
        start={200}
        end={-250}
      />
      <ParallaxImage
        className="ml-[-150px] w-5/12 rounded-sm shadow-2xl shadow-zinc-900/80"
        alt="Astronauts"
        src="/images/smooth-scroll/astronauts.jpg"
        start={100}
        end={-500}
      />
      <ParallaxImage
        className="ml-96 w-8/12 rounded-sm shadow-2xl shadow-zinc-900/80"
        alt="Starship"
        src="/images/smooth-scroll/starship.jpg"
        start={-50}
        end={-600}
      />
    </div>
  );
};

export default ParallaxImages;
