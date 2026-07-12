'use client';

import { ACCENT, BG_IMAGE } from '@/lib/designTokens';
import { AnimatedDiv } from '@repo/ui/animation/core';
import { BsFillDropletFill } from '@repo/ui/icons/react-icons/bs';
import { FaWheatAwn } from '@repo/ui/icons/react-icons/fa6';
import {
  PiArrowUpBold,
  PiBirdFill,
  PiCatFill,
  PiForkKnifeFill,
  PiStarFill,
  PiTargetBold
} from '@repo/ui/icons/react-icons/pi';
import { ComponentType } from 'react';

import PageHeader from './PageHeader';
import { Aurora } from './primitives';
import TipSection from './TipSection';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

type Section = {
  title: string;
  Icon: ComponentType<{ className?: string }>;
  accent: string;
  items: string[];
};

const SECTIONS: Section[] = [
  {
    title: 'Flying',
    Icon: PiBirdFill,
    accent: '#ffd24b',
    items: [
      'Tap the screen to flap and gain altitude.',
      'Tap the left side to turn left, right to turn right, center to fly straight.',
      'Stop flapping to glide and descend.',
      'Hit the ground and a cat catches you — game over.'
    ]
  },
  {
    title: 'Food & Water',
    Icon: FaWheatAwn,
    accent: '#b9f05a',
    items: [
      'Food and water drain as you fly — watch the gauges up top.',
      'Land on feeders to eat, birdbaths to drink.',
      'A green glow on the screen edge points to the nearest feeder.',
      'A blue glow points to the nearest birdbath.',
      'If either empties, your bird goes down.'
    ]
  },
  {
    title: 'Feeding & Drinking',
    Icon: PiForkKnifeFill,
    accent: '#65e7ff',
    items: [
      'Fly near a feeder or birdbath to land automatically.',
      'You eat or drink while perched, earning score.',
      'The threat meter fills while perched — leave before it maxes out.',
      'Tap the screen to fly away after a short landing delay.'
    ]
  },
  {
    title: 'Dangerous Feeders',
    Icon: PiCatFill,
    accent: '#ff4d6d',
    items: [
      'Some feeders have a cat lurking nearby.',
      'The threat meter fills much faster — react immediately.',
      'Stay too long and the cat catches you.'
    ]
  },
  {
    title: 'Eagle Attacks',
    Icon: PiTargetBold,
    accent: '#ff9a3d',
    items: [
      'Eagles hunt you periodically during flight.',
      'Turn hard (90°) during the dodge window to evade.',
      'Near the altitude limit? Tap rapidly (3 taps) instead.',
      'Dodging an eagle earns bonus points.'
    ]
  },
  {
    title: 'Altitude Limit',
    Icon: PiArrowUpBold,
    accent: '#9f6bff',
    items: [
      'Fly too high and an eagle starts hunting you.',
      'You have 4 seconds to descend — stop flapping.',
      'Drop below the warning level and the eagle backs off.'
    ]
  },
  {
    title: 'Scoring',
    Icon: PiStarFill,
    accent: '#ffd24b',
    items: [
      'Score increases over time as you fly.',
      'Eating and drinking earns extra points.',
      'Dodging eagles gives a big score bonus.'
    ]
  },
  {
    title: 'Bird Species',
    Icon: BsFillDropletFill,
    accent: '#2f7bff',
    items: [
      'Each bird has different stats — speed, power, stamina, and more.',
      'Some birds are faster but drain food quicker.',
      'Try all four to find your favourite.'
    ]
  }
];

const Tips = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <AnimatedDiv
      className="absolute inset-0 z-50 flex flex-col overflow-hidden"
      style={{ background: BG_IMAGE }}
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={spring}
    >
      <Aurora colors={[ACCENT.main, '#4aa0ff']} opacity={0.4} />
      <div className="absolute inset-0 bg-[rgba(5,8,20,0.55)] backdrop-blur-[10px]" />

      <div className="relative z-10 my-5 flex h-full flex-col gap-4 px-6">
        <PageHeader title="How to Fly" onBack={handleBack} />

        <div
          className="scroll flex flex-1 flex-col gap-3 overflow-auto pr-1 pb-10"
          style={{ scrollbarWidth: 'none' }}
        >
          {SECTIONS.map((section, i) => (
            <AnimatedDiv
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.2 + i * 0.06 }}
            >
              <TipSection
                title={section.title}
                Icon={section.Icon}
                accent={section.accent}
              >
                {section.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </TipSection>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </AnimatedDiv>
  );
};

export default Tips;
