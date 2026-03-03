import Image from 'next/image';
import Link from 'next/link';
import { cn } from 'lib/utils';

import AnimatedDiv from './AnimatedDiv';
import AnimatedText from './AnimatedText';
import AnimatedTitle from './AnimatedTitle';

const StaffPick = (): React.ReactNode => {
  return (
    <AnimatedDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mb-28 flex w-full items-start justify-center"
    >
      <div className="relative mx-5 flex w-screen flex-col gap-4 rounded-3xl bg-[#F0E5B2] md:w-1/2">
        <Image
          src="/images/staff-pick.png"
          width={600}
          height={600}
          alt="Staff Pick"
        />
        {/* TEXT */}
        <div className="mb-8 mt-3 flex flex-col items-start justify-center gap-2">
          <AnimatedTitle className="mx-5 font-decoy text-2xl text-primary">
            Sarah and Friends
          </AnimatedTitle>
          <AnimatedText className="font-work-sans mx-5 text-base text-primary">
            Want to create a pond for birds to support local wildlife, provide a
            peaceful oasis, and promote biodiversity.{' '}
            <Link
              href="/readmore"
              className="font-work-sans font-bold underline"
            >
              Read more
            </Link>
          </AnimatedText>
        </div>
        <div className="relative h-10 w-full overflow-hidden rounded-b-3xl bg-white/20 md:mt-10 md:w-1/2">
          <div className="absolute inset-0 flex items-center justify-start px-5">
            <span className="text-sm text-black">
              <strong>1129</strong> / 1500 votes to get funded
            </span>
          </div>

          <AnimatedDiv
            className={cn('h-10 rounded-br-3xl rounded-tr-3xl bg-[#F4A1BA]')}
            initial={{ width: '10%', opacity: 1 }}
            whileInView={{ width: '80%' }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{
              width: { duration: 1.5, ease: 'easeOut' }
            }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    </AnimatedDiv>
  );
};

export default StaffPick;
