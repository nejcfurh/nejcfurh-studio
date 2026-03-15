'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { JSX, RefObject, useRef, useState, useEffect } from 'react';
import SectionHeading from '@/app/components/SectionHeading';
import Image from 'next/image';
import { experiences } from '../constants';

interface ExperienceProps {
  mainRef: RefObject<HTMLElement | null>;
}

interface StackCardProps {
  experience: (typeof experiences)[0];
  index: number;
  total: number;
}

const StackCard = ({
  experience,
  index,
  total,
}: StackCardProps): JSX.Element => {
  return (
    <div
      className="flex-shrink-0 w-[340px] sm:w-[500px] lg:w-[600px] xl:w-[700px]"
      style={{ zIndex: index }}
    >
      <div className="p-6 sm:p-8 h-full flex flex-col gap-4 rounded-3xl border border-white/[0.08] bg-[#0a0a0a]">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden">
            <Image
              src={experience.icon}
              alt={experience.company_name}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-white-100 font-semibold text-lg leading-tight">
              {experience.title}
            </h3>
            <p className="text-accent text-sm mt-0.5">
              {experience.company_name}
            </p>
            <p className="text-secondary text-xs font-mono tracking-wider mt-1">
              {experience.date}
            </p>
          </div>
        </div>

        <ul className="space-y-2">
          {experience.points.map((point, i) => (
            <li
              key={i}
              className="text-secondary text-[15px] leading-relaxed flex gap-3"
            >
              <span className="text-accent mt-1.5 shrink-0">
                <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                  <circle cx="3" cy="3" r="3" />
                </svg>
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>

        {/* Progress dots */}
        <div className="mt-auto pt-4 flex items-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full ${
                i <= index ? 'w-6 bg-accent' : 'w-2 bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const Experience = ({ mainRef }: ExperienceProps): JSX.Element => {
  const targetRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const [endX, setEndX] = useState(0);
  const total = experiences.length;

  // Measure how far we need to scroll horizontally
  useEffect(() => {
    const measure = () => {
      if (scrollContentRef.current) {
        const scrollWidth = scrollContentRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const lastCard = scrollContentRef.current.lastElementChild;
        const lastCardWidth = lastCard
          ? lastCard.getBoundingClientRect().width
          : 0;
        setEndX(-(scrollWidth - viewportWidth + lastCardWidth * 0.35));
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    container: mainRef,
  });

  // Map vertical scroll to exact pixel horizontal translation
  const x = useTransform(scrollYProgress, [0, 1], [0, endX]);

  return (
    <section id="experience" className="relative">
      {/* Tall container — creates scroll distance */}
      <div ref={targetRef} className="h-[400vh] relative">
        {/* Sticky viewport */}
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="gradient-orb gradient-orb-accent w-[400px] h-[400px] hidden sm:block -top-[150px] -right-[150px] absolute" />
            <div className="gradient-orb gradient-orb-accent w-[400px] h-[400px] hidden sm:block -bottom-[150px] -left-[150px] absolute" />
          </div>
          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 w-full mb-6">
            <SectionHeading label="My Career" title="Work Experience." />
          </div>

          {/* Horizontally moving cards */}
          <motion.div
            ref={scrollContentRef}
            style={{ x }}
            className="flex gap-6 pl-6 sm:pl-8 lg:pl-[calc((100vw-72rem)/2+3rem)] pr-6 sm:pr-8 lg:pr-[calc((100vw-72rem)/2+3rem)]"
          >
            {[...experiences].reverse().map((experience, index) => (
              <StackCard
                key={experience.title + experience.date}
                experience={experience}
                index={index}
                total={total}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
