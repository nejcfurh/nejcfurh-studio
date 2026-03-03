import Image from 'next/image';
import Link from 'next/link';

import AnimatedDiv from './AnimatedDiv';

const HeroCTA = (): React.ReactNode => {
  return (
    <AnimatedDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="relative flex w-full flex-col items-center justify-center"
    >
      <Image
        src="/images/friends-of-nature-hero.png"
        width={900}
        height={900}
        alt="Friends of Nature"
        className="mt-10 w-full px-5 md:hidden"
      />
      <Image
        src="/images/friends-of-nature-hero-desktop.png"
        width={1000}
        height={1000}
        alt="Friends of Nature"
        className="mt-10 hidden w-5/6 md:flex"
      />
      <AnimatedDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-8 md:hidden"
      >
        <Link href="/how-to-help" className="no-tap-highlight">
          <div className="font-archivo shadow-primary/50 rounded-full bg-[#F4A1BA] px-12 py-3 font-semibold text-[#9B445E] shadow-lg md:px-24 md:py-3">
            How can I help?
          </div>
        </Link>
      </AnimatedDiv>
    </AnimatedDiv>
  );
};

export default HeroCTA;
