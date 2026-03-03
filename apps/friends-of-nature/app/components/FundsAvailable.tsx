'use client';

import AnimatedDiv from 'app/components/AnimatedDiv';
import { cn } from 'lib/utils';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FundsAvailable = ({
  moneyRaised
}: {
  moneyRaised: number;
}): React.ReactNode => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (): void => {
    setIsExpanded((): boolean => !isExpanded);
  };

  return (
    <AnimatedDiv
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="mt-10 flex flex-col items-center justify-center rounded-2xl bg-[#F0E5B2]"
    >
      <div className="relative h-12 w-full overflow-hidden rounded-t-2xl bg-[#1a5632]/10 md:mt-10 md:w-1/2">
        <AnimatedDiv
          className={cn('h-12 rounded-r-full bg-[#B4BD02]')}
          initial={{ width: '10%', opacity: 1 }}
          whileInView={{ width: '75%' }}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{
            width: { duration: 1.5, ease: 'easeOut' }
          }}
          viewport={{ once: true }}
        />
        <div className="font-decoy absolute top-0 mt-1 flex w-full items-center justify-center text-2xl font-bold text-[#1a5632]">
          {' '}
          ${moneyRaised.toLocaleString()}
        </div>
      </div>
      <div className="font-archivo mt-2 text-lg text-black/75">
        Funds available for your yard makeovers
      </div>
      <button
        type="button"
        className="no-tap-highlight mt-4 flex w-fit cursor-pointer flex-col justify-between rounded-lg lg:m-0 lg:w-full"
        onClick={(): void => toggleExpand()}
      >
        <div className="flex w-full flex-row items-center justify-between">
          <div className="font-decoy my-5 w-full px-5 text-left text-3xl font-bold text-[#1a5632]">
            Who is eligible?
          </div>
          <div
            data-state={isExpanded ? 'expanded' : 'closed'}
            className="flex transform px-5 opacity-50 transition-all duration-300 ease-in-out data-[state=expanded]:rotate-180"
          >
            <ChevronDown color="#1a5632" />
          </div>
        </div>
        <div
          className={cn(
            'overflow-hidden transition-all duration-500 ease-in-out',
            isExpanded ? 'max-h-28 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <p className="font-archivo mb-5 px-5 !text-left !text-lg !text-black/75">
            Anyone who is part of the Friends of Nature movement and has
            completed their first-week streak.
          </p>
        </div>
      </button>
    </AnimatedDiv>
  );
};

export default FundsAvailable;
