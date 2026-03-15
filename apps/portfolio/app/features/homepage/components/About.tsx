'use client';

import { motion } from 'framer-motion';
import { JSX } from 'react';
import SectionHeading from '@/app/components/SectionHeading';
import { MapPin, Briefcase, Code, GraduationCap, Sparkles } from 'lucide-react';
import { FaNodeJs, FaReact } from 'react-icons/fa';
import { FaCss3, FaHtml5, FaJs } from 'react-icons/fa6';
import { GrGraphQl } from 'react-icons/gr';
import { IoLogoVercel } from 'react-icons/io5';
import {
  SiExpress,
  SiFramer,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiRedux,
  SiTypescript,
  SiVercel,
} from 'react-icons/si';
import { TbBrandTailwind } from 'react-icons/tb';

const TECH_STACK_DATA = [
  { name: 'HTML', icon: <FaHtml5 /> },
  { name: 'CSS', icon: <FaCss3 /> },
  { name: 'JavaScript', icon: <FaJs /> },
  { name: 'TypeScript', icon: <SiTypescript /> },
  { name: 'React', icon: <FaReact /> },
  { name: 'Next.js', icon: <IoLogoVercel /> },
  { name: 'Node.js', icon: <FaNodeJs /> },
  { name: 'Express.js', icon: <SiExpress /> },
  { name: 'MongoDB', icon: <SiMongodb /> },
  { name: 'PostgreSQL', icon: <SiPostgresql /> },
  { name: 'Redux Toolkit', icon: <SiRedux /> },
  { name: 'Prisma', icon: <SiPrisma /> },
  { name: 'Vercel', icon: <SiVercel /> },
  { name: 'Framer Motion', icon: <SiFramer /> },
  { name: 'Tailwind CSS', icon: <TbBrandTailwind /> },
  { name: 'GraphQL', icon: <GrGraphQl /> },
];

const fadeInAnimationVariants = {
  initial: { opacity: 0, y: 100 },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05 },
  }),
};

const infoCards = [
  {
    icon: Briefcase,
    label: 'Current Role',
    title: 'Product Engineer',
    subtitle: 'BirdBuddy Inc.',
    accent: 'from-accent/20 to-transparent',
    delay: 0.1,
  },
  {
    icon: MapPin,
    label: 'Location',
    title: 'Slovenia / US',
    subtitle: 'Remote & On-site',
    accent: 'from-purple-500/20 to-transparent',
    delay: 0.15,
  },
  {
    icon: GraduationCap,
    label: 'Education',
    title: "Master's Degree",
    subtitle: 'International Relations',
    accent: 'from-emerald-500/20 to-transparent',
    delay: 0.2,
  },
  {
    icon: Code,
    label: 'Freelance',
    title: 'Web Developer',
    subtitle: 'Since 2022',
    accent: 'from-amber-500/20 to-transparent',
    delay: 0.25,
  },
];

const About = (): JSX.Element => {
  return (
    <section id="about" className="relative py-32 overflow-hidden">
      <div className="gradient-orb gradient-orb-accent w-[400px] h-[400px] hidden sm:block -top-[150px] -left-[150px] absolute" />
      <div className="gradient-orb gradient-orb-accent w-[400px] h-[400px] hidden sm:block -bottom-[150px] -right-[150px] absolute" />
      <span className="hash-span">&nbsp;</span>
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionHeading label="Introduction" title="About Me." />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Bio - spans 2 cols */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-8 md:col-span-2 md:row-span-2 relative overflow-hidden"
          >
            {/* Subtle corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full" />

            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={14} className="text-accent" />
              <span className="text-accent text-lg font-mono tracking-wider uppercase">
                Who I Am
              </span>
            </div>

            <p className="text-secondary leading-relaxed text-[15px]">
              I&apos;m a full-stack web developer and product engineer, driven
              by curiosity since childhood — dismantling gadgets and breaking
              them. From &ldquo;Hello, world&rdquo; in plain JavaScript to
              delivering great experiences in React, I&apos;ve built custom APIs
              with Node.js and Express, including custom authentication.
            </p>
            <p className="text-secondary leading-relaxed text-[15px] mt-4">
              I obsess over{' '}
              <span className="text-white-100 font-medium">
                pixel-perfect designs
              </span>{' '}
              and{' '}
              <span className="text-white-100 font-medium">
                seamless interactions
              </span>
              . My goal is to bring creative visions to life through code and
              design.
            </p>
          </motion.div>

          {/* Info cards */}
          {infoCards.map(card => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: card.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="glass-card glass-card-hover p-6 flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Gradient background on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10 flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center shrink-0 group-hover:border-accent/30 transition-colors duration-300">
                  <card.icon size={18} className="text-accent" />
                </div>
                <p className="text-secondary text-base font-mono tracking-wider uppercase">
                  {card.label}
                </p>
              </div>

              <div className="relative z-10">
                <p className="text-white-100 font-semibold text-base">
                  {card.title}
                </p>
                <p className="text-secondary text-sm mt-0.5">{card.subtitle}</p>
              </div>
            </motion.div>
          ))}

          {/* Tech Stack - spans full width */}
          <div className="md:col-span-4 py-10">
            <ul className="flex flex-wrap items-center justify-center gap-2">
              {TECH_STACK_DATA.map((tech, index) => (
                <motion.li
                  key={tech.name}
                  variants={fadeInAnimationVariants}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  custom={index}
                  className="border border-white/10 rounded-2xl px-4 py-2 flex items-center gap-3 min-w-[120px] justify-center text-sm text-white-100 hover:border-accent/30 hover:bg-accent/5 transition-colors duration-300"
                >
                  {tech.icon} {tech.name}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
