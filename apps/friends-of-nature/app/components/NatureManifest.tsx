import Link from 'next/link';

import AnimatedDiv from './AnimatedDiv';
import AnimatedText from './AnimatedText';
import AnimatedTitle from './AnimatedTitle';

const NatureManifest = (): React.ReactNode => {
  return (
    <div className="z-20 flex h-full w-full flex-col items-center justify-center rounded-3xl bg-[#F4A1BA] px-5 py-8">
      <div className="flex w-full flex-col gap-8 md:w-1/2">
        <AnimatedTitle
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="font-decoy mt-10 text-3xl text-[#9B445E]"
        >
          Conservation starts with You. Me. All of us.{' '}
        </AnimatedTitle>
        <AnimatedText
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="font-work-sans text-xl text-black/50"
        >
          We&apos;ve been told conservation happens in remote places, in
          national parks, by scientists. But what if we told you—real change
          starts at home?
        </AnimatedText>
        <AnimatedDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex w-full justify-center pb-10"
        >
          <Link
            href="/manifesto"
            className="no-tap-highlight w-full rounded-full bg-[#396089] py-4 text-center text-base font-bold text-[#F0E5B2] transition-all duration-300 ease-in-out hover:opacity-75 md:w-1/3"
          >
            Read Our Manifesto
          </Link>
        </AnimatedDiv>
      </div>
    </div>
  );
};

export default NatureManifest;
