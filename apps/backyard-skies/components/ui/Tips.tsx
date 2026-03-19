'use client';

import { AnimatedButton, AnimatedDiv } from '@repo/ui/animation/core';
import { BiChevronLeft } from 'react-icons/bi';

import TipSection from './TipSection';

const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

const Tips = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <AnimatedDiv
      className="absolute inset-0 z-50 flex flex-col bg-[url('/menu-bg.jpg')] bg-cover bg-center bg-no-repeat"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={spring}
    >
      <div className="flex h-full flex-col px-6 pt-7.5">
        <AnimatedDiv
          className="relative mb-6 flex items-center justify-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.2 }}
        >
          <AnimatedButton
            onClick={handleBack}
            className="absolute left-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-black/8 text-lg text-black"
            whileTap={{ scale: 0.85 }}
            transition={spring}
          >
            <BiChevronLeft />
          </AnimatedButton>
          <span className="text-lg font-bold tracking-[0.25em] text-black/70 uppercase">
            Tips & Tricks
          </span>
        </AnimatedDiv>

        <div
          style={{ scrollbarWidth: 'none' }}
          className="flex flex-1 flex-col gap-3 overflow-auto"
        >
          {[
            {
              title: 'Flying',
              icon: '🕊',
              tips: [
                <li key="1">Tap the screen to flap and gain altitude</li>,
                <li key="2">
                  Tap left side to turn left, right side to turn right, center
                  to go straight
                </li>,
                <li key="3">Stop flapping to glide and descend</li>,
                <li key="4">
                  Hit the ground and a cat catches you — game over!
                </li>
              ]
            },
            {
              title: 'Food & Water',
              icon: '🌾',
              tips: [
                <li key="1">
                  Food and water drain as you fly — watch the top gauges
                </li>,
                <li key="2">Land on feeders to eat, birdbaths to drink</li>,
                <li key="3">
                  Green glow on screen edge points to nearest feeder
                </li>,
                <li key="4">Blue glow points to nearest birdbath</li>,
                <li key="5">If either runs out, your bird goes down!</li>
              ]
            },
            {
              title: 'Feeding & Drinking',
              icon: '🍽',
              tips: [
                <li key="1">
                  Fly near a feeder or birdbath to land automatically
                </li>,
                <li key="2">
                  Your bird eats or drinks while perched, earning score
                </li>,
                <li key="3">
                  A threat meter fills while perched — leave before it maxes
                  out!
                </li>,
                <li key="4">
                  Tap the screen to fly away after a short landing delay
                </li>
              ]
            },
            {
              title: 'Dangerous Feeders',
              icon: '🐱',
              tips: [
                <li key="1">Some feeders have a cat lurking nearby</li>,
                <li key="2">
                  The threat meter fills much faster — react immediately!
                </li>,
                <li key="3">Stay too long and the cat catches you</li>
              ]
            },
            {
              title: 'Eagle Attacks',
              icon: '🦅',
              tips: [
                <li key="1">Eagles hunt you periodically during flight</li>,
                <li key="2">
                  Turn hard (90°) during the dodge window to evade
                </li>,
                <li key="3">
                  Near the altitude limit? Tap rapidly (3 taps) instead
                </li>,
                <li key="4">Dodging an eagle earns bonus points!</li>
              ]
            },
            {
              title: 'Altitude Limit',
              icon: '⬆',
              tips: [
                <li key="1">Fly too high and an eagle starts hunting you</li>,
                <li key="2">You have 4 seconds to descend — stop flapping!</li>,
                <li key="3">
                  Drop below the warning level and the eagle backs off
                </li>
              ]
            },
            {
              title: 'Scoring',
              icon: '⭐',
              tips: [
                <li key="1">Score increases over time as you fly</li>,
                <li key="2">Eating and drinking earns extra points</li>,
                <li key="3">Dodging eagles gives a big score bonus</li>
              ]
            },
            {
              title: 'Bird Species',
              icon: '🐦',
              tips: [
                <li key="1">
                  Each bird has different stats — speed, power, stamina and more
                </li>,
                <li key="2">Some birds are faster but drain food quicker</li>,
                <li key="3">Try all four to find your favourite!</li>
              ]
            }
          ].map((section, i) => (
            <AnimatedDiv
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...spring, delay: 0.2 + i * 0.06 }}
            >
              <TipSection title={section.title} icon={section.icon}>
                {section.tips}
              </TipSection>
            </AnimatedDiv>
          ))}
        </div>
      </div>
    </AnimatedDiv>
  );
};

export default Tips;
