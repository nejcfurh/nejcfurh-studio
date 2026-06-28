'use client';

import { useReducedMotion } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';

const ROOMS = [
  {
    name: 'The Sanctum',
    desc: 'Intimate elegance for the discerning solo traveler. Bathed in golden warmth.',
    price: 'From $320 / night'
  },
  {
    name: 'The Arcadia Suite',
    desc: 'Spacious grandeur with arched windows overlooking the grounds.',
    price: 'From $580 / night'
  },
  {
    name: 'The Elysian Hall',
    desc: 'Our finest — a palatial retreat of unparalleled luxury and privacy.',
    price: 'From $1,200 / night'
  }
];

const EASE = [0.215, 0.61, 0.355, 1] as const;

export default function RoomsSection() {
  const reduce = useReducedMotion();

  const cardVariants = reduce
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.4 } }
      }
    : {
        hidden: { opacity: 0, y: 24, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.7, ease: EASE }
        }
      };

  return (
    <section
      id="rooms"
      className="relative z-10 flex flex-col items-center py-36 text-center"
    >
      <div className="mb-8 h-px w-16 bg-linear-to-r from-transparent via-[#d4a954] to-transparent" />
      <p className="mb-4 text-sm tracking-[0.3em] text-[#d4a954]/70 uppercase">
        Accommodations
      </p>
      <h2 className="mb-16 text-3xl font-extralight tracking-wider text-white md:text-4xl">
        Our Rooms
      </h2>

      <AnimatedDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        className="grid w-full max-w-5xl gap-10 px-8 md:grid-cols-3"
      >
        {ROOMS.map((room) => (
          <AnimatedDiv
            key={room.name}
            variants={cardVariants}
            whileHover={
              reduce
                ? undefined
                : {
                    y: -8,
                    boxShadow: '0 24px 50px -20px rgba(212, 169, 84, 0.25)'
                  }
            }
            whileTap={reduce ? undefined : { y: -2, scale: 0.99 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <a
              href="#contact"
              className="group block h-full cursor-pointer border border-white/10 bg-white/2 p-8 text-center backdrop-blur-sm transition-colors duration-300 hover:border-[#d4a954]/30 hover:bg-white/4"
            >
              <h3 className="mb-4 text-lg font-light tracking-wider text-white transition-colors duration-300 group-hover:text-[#d4a954]">
                {room.name}
              </h3>
              <p className="mb-6 text-sm leading-relaxed font-light text-white/40">
                {room.desc}
              </p>
              <p className="text-sm tracking-wider text-[#d4a954]/70">
                {room.price}
              </p>
            </a>
          </AnimatedDiv>
        ))}
      </AnimatedDiv>
    </section>
  );
}
