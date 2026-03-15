'use client';

import AnimatedDiv from '@/app/components/motion/AnimatedDiv';
import { type MotionValue, useScroll, useTransform } from 'framer-motion';
import React, { JSX, useRef } from 'react';

interface Card {
  id: string;
  color: string;
  textColor: string;
  title?: string;
  company_name?: string;
  icon: string;
  iconBg: string;
  date?: string;
  points?: string[];
  content: CardContent[];
  rotation: number;
  image: string;
}

type CardContent = {
  institution?: string;
  location?: string;
  description?: string;
};

interface StackedCardsProps {
  cards?: Card[];
}

const defaultCards: Card[] = [
  {
    id: 'EDUCATION',
    color: '#76A5D8',
    textColor: '#396089',
    title: 'Master of International Relations',
    company_name: 'University of Ljubljana Faculty of Social Sciences',
    icon: '/icons/education-icon.png',
    iconBg: '#E6DEDD',
    points: [
      'Study of international relations theory, political science, and economics.',
      'Completed research projects on European Union policies.',
      'Graduated with distinction.',
    ],
    content: [
      {
        institution: 'University of Ljubljana Faculty of Social Sciences',
        location: 'Ljubljana, Slovenia',
      },
      {
        institution: 'Europa Universität Viadrina',
        location: 'Frankfurt (Oder), Germany',
      },
      {
        institution: 'Instituto Superior de Ciências Sociais e Políticas',
        location: 'Lisbon, Portugal',
      },
    ],
    rotation: -4,
    image: '/images/card-step-1.png',
  },
  {
    id: 'EXPERT ADVISOR & DIPLOMAT',
    color: '#76A5D8',
    textColor: '#396089',
    company_name: 'Ministry of Foreign and European Affairs - Slovenia',
    icon: '/icons/diplomat-icon.png',
    iconBg: '#E6DEDD',
    date: 'December 2019 - April 2022',
    points: [
      'Conducted analysis of political and economic policies and implemented public relations strategies.',
      'Collaborated with cross-functional teams for organization of official political and economic delegation visits.',
      'Co-led the Youth Forum for Eastern Partnership during Slovenian Presidency of the Council of the EU in 2021.',
    ],
    content: [
      {
        description:
          'Conducted analysis of political and economic policies and implemented public relations strategies',
      },
      {
        description:
          'Collaborated with cross-functional teams for organization of official political and economic delegation visits',
      },
      {
        description:
          'Co-led the Youth Forum for Eastern Partnership during Slovenian Presidency of the Council of the EU in 2021',
      },
    ],
    rotation: -2,
    image: '/images/card-step-2.png',
  },
  {
    id: 'IT CONSULTANT & SUPPORT SPECIALIST',
    color: '#76A5D8',
    textColor: '#396089',
    company_name: 'Advisera / Conformio - Croatia',
    icon: '/icons/consultant-icon.png',
    iconBg: '#E6DEDD',
    date: 'June 2022 - December 2022',
    points: [
      'Focused on Conformio administration and linking support issues with the development team.',
      'Collaborated with cross-functional teams to create high-quality products.',
      'Provided best customer support and fast resolution of issues through the development team.',
      'Knowledge of ZenDesk, JIRA, Slack, and other production/deployment/administration software.',
    ],
    content: [
      {
        description:
          'Focused on Conformio administration and linking support issues with the development team',
      },
      {
        description:
          'Collaborated with cross-functional teams to create high-quality products',
      },
      {
        description:
          'Provided best customer support and fast resolution of issues through the development team',
      },
      {
        description:
          'Knowledge of ZenDesk, JIRA, Slack, and other production/deployment/administration software',
      },
    ],
    rotation: 0,
    image: '/images/card-step-3.png',
  },
  {
    id: 'WEB / SOFTWARE DEVELOPER',
    color: '#76A5D8',
    textColor: '#396089',
    company_name: 'Self-employed / Freelance',
    icon: '/icons/webdev-icon.png',
    iconBg: '#E6DEDD',
    date: 'October 2022 - Present',
    points: [
      'Developing and maintaining web applications using JavaScript and related technologies.',
      'Implementing responsive design and ensuring cross-browser compatibility.',
      'Working with React, MongoDB, Supabase, SQL, Express, Webflow, TailwindCSS, etc.',
    ],
    content: [
      {
        description:
          'Developing and maintaining web applications using JavaScript and related technologies',
      },
      {
        description:
          'Implementing responsive design and ensuring cross-browser compatibility',
      },
      {
        description:
          'Working with React, MongoDB, Supabase, SQL, Express, Webflow, TailwindCSS, etc.',
      },
    ],
    rotation: 2,
    image: '/images/card-step-4.png',
  },
  {
    id: '3RD LEVEL / TECH SUPPORT',
    color: '#76A5D8',
    textColor: '#396089',
    company_name: 'Birdbuddy Inc. - Slovenia & US',
    icon: '/icons/birdbuddy-icon.png',
    iconBg: '#E6DEDD',
    date: 'December 2022 - January 2024',
    points: [
      'Provide last-level support to customers experiencing issues with Birdbuddy products and services.',
      'Collaborated with cross-functional teams including designers, product managers, and developers to create high-quality products.',
      'Diagnose and resolve technical problems by guiding customers through step-by-step solutions.',
      'Collect feedback and recurring issues to improve product performance and customer satisfaction.',
    ],
    content: [
      {
        description:
          'Provide last-level support to customers experiencing issues with Birdbuddy products and services',
      },
      {
        description:
          'Collaborated with cross-functional teams to create high-quality products',
      },
      {
        description:
          'Diagnose and resolve technical problems by guiding customers through step-by-step solutions',
      },
      {
        description:
          'Collect feedback and recurring issues to improve product performance and customer satisfaction',
      },
    ],
    rotation: 4,
    image: '/images/card-step-5.png',
  },
  {
    id: 'HEAD OF CUSTOMER ENGAGEMENT',
    color: '#76A5D8',
    textColor: '#396089',
    company_name: 'Birdbuddy Inc. - Slovenia & US',
    icon: '/icons/birdbuddy-icon.png',
    iconBg: '#E6DEDD',
    date: 'February 2024 - October 2024',
    points: [
      'Enhance customer experience, solidify brand identity, and cultivate a community of engaged users, power users, and champions.',
      'Enhance public reputation through proactive customer interactions, ensure product excellence, and prevent issues through quality assurance.',
      'Efficiently resolve user concerns to protect and uplift the brand reputation.',
    ],
    content: [
      {
        description:
          'Enhance customer experience, solidify brand identity, and cultivate a community of engaged users, power users, and champions',
      },
      {
        description:
          'Enhance public reputation through proactive customer interactions, ensure product excellence, and prevent issues through quality assurance',
      },
      {
        description:
          'Efficiently resolve user concerns to protect and uplift the brand reputation',
      },
    ],
    rotation: 4,
    image: '/images/card-step-6.png',
  },
  {
    id: 'PRODUCT ENGINEER',
    color: '#76A5D8',
    textColor: '#396089',
    company_name: 'Birdbuddy Inc. - Slovenia & US',
    icon: '/icons/birdbuddy-icon.png',
    iconBg: '#E6DEDD',
    date: 'October 2024 - Present',
    points: [
      'Enhance user experience and build a loyal community with seamless React and Next.js interfaces.',
      'Strengthen brand reputation by ensuring product excellence through quality React and GraphQL solutions.',
      'Resolve user issues swiftly to protect and elevate brand reputation with responsive front-end development.',
    ],
    content: [
      {
        description:
          'Enhance user experience and build a loyal community with seamless React and Next.js interfaces',
      },
      {
        description:
          'Strengthen brand reputation by ensuring product excellence through quality React and GraphQL solutions',
      },
      {
        description:
          'Resolve user issues swiftly to protect and elevate brand reputation with responsive front-end development',
      },
    ],
    rotation: 0,
    image: '/images/card-step-7.png',
  },
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
  scrollYProgress,
}: CardComponentProps): JSX.Element => {
  const scrollThreshold = index * 0.12;

  const opacity = useTransform(
    scrollYProgress,
    [scrollThreshold, scrollThreshold + 0.01],
    [0, 1],
  );

  const y = useTransform(
    scrollYProgress,
    [scrollThreshold, scrollThreshold + 0.1],
    [100, 0],
  );

  const rotate = useTransform(
    scrollYProgress,
    [scrollThreshold, scrollThreshold + 0.1],
    [0, card.rotation],
  );

  const zIndex = index;

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
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* MOBILE */}
      <div className="md:hidden">
        <div className="text-2xl uppercase text-center">{card.id}</div>
        <div>
          <h2 className="font-bold mt-5 text-xl md:mb-8 md:text-5xl">
            {card.title}
          </h2>
          <div className="border-t-[1px] border-black/20 w-full my-3" />
          <p className="font-archivo text-base text-center items-center justify-evenly flex w-full flex-col md:text-3xl">
            {card.content.map((item: CardContent, index: number) => (
              <span
                key={index}
                className="w-full flex flex-col items-center my-4 gap-2"
              >
                {item.institution && (
                  <span className="w-3/4 font-bold">{item.institution}</span>
                )}
                {item.location && (
                  <span className="w-full italic opacity-80">
                    {item.location}
                  </span>
                )}
                {item.description && (
                  <span className="text-center">{item.description}</span>
                )}
              </span>
            ))}
          </p>
        </div>
        <div className="mt-4 text-center font-bold">{card.date}</div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex md:flex-1">
        <div className="flex flex-col justify-between">
          <div className="font-decoy text-2xl uppercase">{card.id}</div>
          <div>
            <h2 className="mb-4 font-decoy text-3xl md:mb-8 md:text-3xl">
              {card.title}
            </h2>
            <div className="font-archivo text-lg md:text-3xl">
              {card.content.map((item: CardContent, index: number) => (
                <div key={index}>
                  {item.institution && <strong>{item.institution}</strong>}
                  {item.location && (
                    <>
                      {' - '}
                      <span className="inline italic">{item.location}</span>
                    </>
                  )}
                  {item.description && (
                    <p className="mt-2">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 text-center font-bold">{card.date}</div>
      </div>
    </AnimatedDiv>
  );
};

const StackedCards = ({
  cards = defaultCards,
}: StackedCardsProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div
      ref={containerRef}
      className="relative mt-32 h-[580vh] md:h-[650vh] md:mt-52"
    >
      <div
        className="sticky top-1/2 z-30 h-[75vh] max-h-[600px] w-[90vw]"
        style={{
          transform: 'translateY(-50%)',
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
