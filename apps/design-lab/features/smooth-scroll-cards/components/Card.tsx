'use client';

import {
  MotionValue,
  useMotionTemplate,
  useScroll,
  useTransform,
  Variants
} from '@repo/ui/animation';
import {
  AnimatedDiv,
  AnimatedImage,
  AnimatedSubTitle,
  AnimatedText
} from '@repo/ui/animation/core';
import { FiEye, FiGithub } from '@repo/ui/icons/react-icons/fi';
import { HiArrowUpRight } from '@repo/ui/icons/react-icons/hi2';
import { useRef } from 'react';

import { CardDataType } from '../types';

const overlayContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 }
  }
};

const overlayItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const pillBase =
  'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold';

const Card = ({
  name,
  description,
  tags,
  image,
  source_code_link,
  link,
  has_preview,
  index,
  range,
  targetScale,
  progress
}: CardDataType & {
  index: number;
  range: [number, number];
  targetScale: number;
  progress: MotionValue<number>;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1]);

  const cardScale = useTransform(progress, range, [1, targetScale]);

  const blurAmount = useTransform(scrollYProgress, [0, 1], [10, 0]);

  const imageFilter = useMotionTemplate`blur(${blurAmount}px)`;

  return (
    // CARD CONTAINER STYLE
    <div
      ref={containerRef}
      className="sticky top-0 mx-auto flex h-screen justify-center"
    >
      {/* CARD STYLE */}
      <AnimatedDiv
        className="relative mt-[30vh] h-[340px] w-[1000px] max-w-[90vw] origin-top overflow-hidden rounded-2xl border-2 border-white/60 sm:h-[500px]"
        style={{ top: `calc(-10% + ${index * 25}px)`, scale: cardScale }}
      >
        <AnimatedImage
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full w-full object-cover"
          src={image}
          alt={name}
          style={{
            scale: imageScale,
            filter: imageFilter
          }}
        />

        {/* CONTENT OVERLAY */}
        <AnimatedDiv
          className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/95 via-black/65 to-transparent p-5 text-white sm:p-8"
          variants={overlayContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <AnimatedSubTitle
            className="text-xl font-bold sm:text-3xl"
            variants={overlayItem}
          >
            {name}
          </AnimatedSubTitle>

          <AnimatedText
            className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80"
            variants={overlayItem}
          >
            {description}
          </AnimatedText>

          <AnimatedDiv
            className="mt-4 flex flex-wrap gap-2"
            variants={overlayContainer}
          >
            {tags.map((tag) => (
              <AnimatedDiv
                key={tag.name}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm"
                style={tag.color ? { color: tag.color } : undefined}
                variants={overlayItem}
              >
                #{tag.name}
              </AnimatedDiv>
            ))}
          </AnimatedDiv>

          <AnimatedDiv
            className="mt-5 flex flex-wrap items-center gap-3"
            variants={overlayItem}
          >
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${pillBase} bg-white text-black transition-transform duration-300 ease-out hover:scale-105 active:scale-95`}
              >
                <span>Visit</span>
                <HiArrowUpRight />
              </a>
            )}

            {source_code_link && (
              <a
                href={source_code_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${pillBase} border border-white/30 transition-colors hover:bg-white/10`}
              >
                <FiGithub />
                <span>Source</span>
              </a>
            )}

            {has_preview && (
              <span className={`${pillBase} border border-white/30`}>
                <FiEye />
                <span>Preview</span>
              </span>
            )}
          </AnimatedDiv>
        </AnimatedDiv>
      </AnimatedDiv>
    </div>
  );
};

export default Card;
