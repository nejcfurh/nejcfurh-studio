'use client';

import { useScroll, useTransform, type MotionValue } from 'framer-motion';
import Image from 'next/image';
import React, { useRef } from 'react';

import AnimatedDiv from './AnimatedDiv';

type Card = {
  id: number;
  color: string;
  textColor: string;
  title: string;
  content: string;
  boldedText: string;
  rotation: number;
  image: string;
};

interface StackedCardsProps {
  cards?: Card[];
}

const defaultCards: Card[] = [
  {
    id: 1, // BOTTOM CARD
    color: '#F4A1BA',
    textColor: '#9B445E',
    boldedText: 'personalized to-do list',
    title: 'Share a bit about yourself',
    content: `Based on the time you're willing to spend helping nature, we’ll craft a personalized to-do list and set the perfect pace for you.`,
    rotation: -4,
    image: '/images/card-step-1.png'
  },
  {
    id: 2, // MIDDLE CARD
    color: '#76A5D8',
    textColor: '#396089',
    boldedText: 'location-tailored actions',
    title: 'Helpful hints, tailored to your world',
    content: `You’ll get short emails with simple, location-tailored actions to create impact—weekly or monthly, based on your time.`,
    rotation: -0,
    image: '/images/card-step-2.png'
  },
  {
    id: 3, // TOP CARD
    color: '#FC7E2F',
    textColor: '#863E11',
    boldedText: 'a yard makeover—on us',
    title: 'Help nature thrive',
    content: `Document your progress and become eligible for a yard makeover—on us.`,
    rotation: 6,
    image: '/images/card-step-3.png'
  }
];

interface CardComponentProps {
  card: Card;
  index: number;
  scrollYProgress: MotionValue<number>;
  totalCards?: number;
}

const CardComponent = ({
  card,
  index,
  scrollYProgress
}: CardComponentProps): React.ReactNode => {
  const scrollThreshold = index * (index > 2 ? 0.3 : 0.22);

  const opacity = useTransform(
    scrollYProgress,
    [scrollThreshold, scrollThreshold + 0.01],
    [0, 1]
  );

  const y = useTransform(
    scrollYProgress,
    [scrollThreshold, scrollThreshold + 0.1],
    [100, 0]
  );

  const rotate = useTransform(
    scrollYProgress,
    [scrollThreshold, scrollThreshold + 0.1],
    [0, card.rotation]
  );

  const zIndex = index;

  function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  }

  function formatContent(content: string, substring: string): React.ReactNode {
    // Create a case-sensitive regex that captures the substring.
    const regex = new RegExp(`(${escapeRegExp(substring)})`);
    // Split the content on the substring while including the matched substring in the array.
    const parts = content.split(regex);

    return (
      <React.Fragment>
        {parts.map((part, index) =>
          regex.test(part) ? <strong key={index}>{part}</strong> : part
        )}
      </React.Fragment>
    );
  }

  return (
    <AnimatedDiv
      className="absolute inset-0 flex flex-col p-6 md:p-20"
      style={{
        opacity,
        y,
        rotate,
        zIndex,
        backgroundColor: card.color,
        color: card.textColor,
        borderRadius: '1.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
      }}
    >
      {/* MOBILE */}
      <div className="md:hidden">
        <div className="font-decoy text-2xl uppercase">Step {card.id}</div>
        <div className="my-10 flex w-full flex-row items-center justify-center">
          <Image src={card.image} alt={card.title} width={250} height={250} />
        </div>
        <div>
          <h2 className="font-decoy mb-4 text-3xl md:mb-8 md:text-5xl">
            {card.title}
          </h2>
          <p className="font-archivo text-lg md:text-3xl">
            {formatContent(card.content, card.boldedText)}
          </p>
        </div>
      </div>
      {/* DESKTOP */}
      <div className="hidden md:flex md:flex-1">
        <div className="flex flex-col justify-between">
          <div className="font-decoy text-2xl uppercase">Step {card.id}</div>
          <div>
            <h2 className="font-decoy mb-4 text-3xl md:mb-8 md:text-5xl">
              {card.title}
            </h2>
            <p className="font-archivo text-lg md:text-3xl">
              {formatContent(card.content, card.boldedText)}
            </p>
          </div>
        </div>
        <div className="my-10 flex w-full flex-row items-center justify-center">
          <Image src={card.image} alt={card.title} width={500} height={500} />
        </div>
      </div>
    </AnimatedDiv>
  );
};

const StackedCards = ({
  cards = defaultCards
}: StackedCardsProps): React.ReactNode => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  return (
    <div ref={containerRef} className="relative mt-32 h-[260vh] md:mt-56">
      <div
        className="sticky top-1/2 z-30 h-[75vh] max-h-[600px] w-[95vw]"
        style={{
          transform: 'translateY(-50%)'
        }}
      >
        {cards.map((card, index) => (
          <CardComponent
            key={card.id}
            card={card}
            index={index}
            scrollYProgress={scrollYProgress}
            totalCards={cards.length}
          />
        ))}
      </div>
    </div>
  );
};

export default StackedCards;
