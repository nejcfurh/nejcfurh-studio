'use client';

import { useRef, useState, MouseEvent, TouchEvent, useEffect } from 'react';
import { motion, MotionStyle, useMotionValue, useSpring } from 'motion/react';
import Image from 'next/image';
import ItemsList from '@/app/staggered-animation/components/ItemsList';

interface HolographicCardProps {
  name: string;
  title: string;
  imageUrl: string;
  logo?: string;
  className?: string;
}

export default function HolographicCard({
  name,
  title,
  imageUrl,
  logo,
  className = '',
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isActive) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const posX = e.clientX - rect.left;
    const posY = e.clientY - rect.top;

    const ratioX = posX / rect.width - 0.35;
    const ratioY = posY / rect.height - 0.35;

    const newPointerX = Math.max(-1, Math.min(1, ratioX * 2));
    const newPointerY = Math.max(-1, Math.min(1, ratioY * 2));

    pointerX.set(newPointerX);
    pointerY.set(newPointerY);

    rotateX.set(newPointerY * 15);
    rotateY.set(newPointerX * -15);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isActive) return;

    const touch = e.touches[0];
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const posX = touch.clientX - rect.left;
    const posY = touch.clientY - rect.top;

    const ratioX = posX / rect.width - 0.5;
    const ratioY = posY / rect.height - 0.5;

    const newPointerX = Math.max(-1, Math.min(1, ratioX * 2));
    const newPointerY = Math.max(-1, Math.min(1, ratioY * 2));

    pointerX.set(newPointerX);
    pointerY.set(newPointerY);

    rotateX.set(newPointerY * 15);
    rotateY.set(newPointerX * -15);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleTouchEnd = () => {
    rotateX.set(0);
    rotateY.set(0);
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleFlip = () => {
    if (isActive) {
      setIsFlipping(true);
      setIsFlipped(!isFlipped);
      // Reset flipping state after animation completes (600ms)
      setTimeout(() => {
        setIsFlipping(false);
      }, 600);
    }
  };

  return (
    <div className="perspective-distant w-80 h-120 sm:w-96 sm:h-144 ">
      <motion.div
        ref={cardRef}
        className={`holographic-card relative w-full h-full will-change-transform cursor-pointer transform-3d overflow-hidden ${className}`}
        data-active={isActive}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={
          {
            rotateX,
            rotateY,
            '--pointer-x': pointerX,
            '--pointer-y': pointerY,
          } as unknown as MotionStyle
        }
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <button
          onClick={handleFlip}
          aria-label="Flip card"
          aria-pressed={isFlipped}
          className="absolute inset-0 z-100 cursor-pointer opacity-0 bg-none border-none"
        />

        <motion.div
          className="relative w-full h-full transform-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* CARD REAR */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl bg-linear-to-br from-black via-slate-900 to-black flex items-center justify-center transform-[rotateY(180deg)] overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              visibility: isFlipped ? 'visible' : 'hidden',
              transition: 'visibility 0.5s',
            }}
          >
            {isFlipped && (
              <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
                {/* TITLE */}
                <motion.h2
                  className="text-xl sm:text-3xl text-gray-200 mb-3 sm:mb-8 tracking-wider font-light"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{
                    opacity: isFlipped ? 1 : 0,
                    y: isFlipped ? 0 : -20,
                  }}
                  transition={{ delay: 0.3 }}
                >
                  TECH STACK
                </motion.h2>
                {/* GRID */}
                <ItemsList
                  className="grid grid-cols-2 gap-3 w-full max-w-sm text-gray-200"
                  classNameItems="relative text-xs sm:text-sm rounded-xl p-1 flex gap-2 items-center justify-center border border-white/30"
                />
              </div>
            )}

            {/* LOGO ELEMENTS */}
            <div className="absolute scale-90 sm:scale-100 sm:top-4 sm:right-4 right-2 top-2 z-60 pointer-events-none">
              <Image
                src="/images/tilt-card/Logo.png"
                alt="Logo Alt"
                width={150}
                height={150}
                priority
              />
            </div>
            <div className="absolute scale-90 sm:scale-100 sm:bottom-4 sm:left-4 bottom-2 left-2 z-60 pointer-events-none">
              <Image
                src="/images/tilt-card/Logo.png"
                alt="Logo Alt"
                width={150}
                height={150}
                priority
              />
            </div>

            {/* BORDER */}
            <div className="absolute inset-0 border-[5px] border-white/30 rounded-2xl pointer-events-none z-50 shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]" />
          </div>

          {/* CARD FRONT */}
          <div
            className="absolute inset-0 backface-hidden rounded-2xl bg-black overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              visibility: isFlipped ? 'hidden' : 'visible',
              transition: 'visibility 0.5s',
            }}
          >
            {/* BASE IMAGE LAYER */}
            <div className="card__image-layer">
              <Image
                src={imageUrl}
                alt={name}
                className="absolute bottom-[-10] w-full h-full object-cover scale-x-[1.04]"
                width={2500}
                height={2000}
                priority
              />
            </div>

            {/* HOLOGRAPHIC OVERLAY */}
            <div
              className="card__holographic z-25 overflow-hidden"
              style={{ display: isFlipping ? 'none' : 'block' }}
            >
              <div className="refraction refraction-1" />
              <div className="refraction refraction-2" />
            </div>

            {/* DETAILS LAYER */}
            <div className="card__details p-6 flex flex-col justify-between pointer-events-none">
              <motion.div
                className="text-right [text-shadow:2px_2px_4px_rgba(0,0,0,0.5)]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : -20 }}
                transition={{ delay: 1 }}
              >
                <h3 className="text-3xl sm:text-5xl font-bold m-0 text-white line-height-1 [text-shadow:-1px_-1px_0_#000,1px_-1px_0_#000,-1px_1px_0_#000,1px_1px_0_#000,2px_2px_8px_rgba(0,0,0,0.5)]">
                  {name}
                </h3>
                <p className="text-xl sm:text-2xl font-sans font-medium m-0 text-white line-height-1 [text-shadow:-1px_-1px_0_#00000083,1px_-1px_0_#00000083,-1px_1px_0_#00000083,1px_1px_0_#00000083,2px_2px_8px_rgba(0,0,0,0.5)]">
                  {title}
                </p>
              </motion.div>

              {/* LOGO  */}
              {logo && (
                <motion.div
                  className="absolute bottom-6 left-6 drop-shadow-lg/70 rounded-full p-3 h-24 w-24 sm:h-32 sm:w-32"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0,
                  }}
                  transition={{ delay: 1.2 }}
                >
                  <Image
                    src={logo}
                    alt="Logo"
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </motion.div>
              )}

              <motion.div
                className="absolute bottom-0 right-0 drop-shadow-lg/70 rounded-full p-3 sm:h-40 sm:w-40 h-32 w-32 object-contain"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: isActive ? 1 : 0,
                  scale: isActive ? 1 : 0,
                }}
                transition={{ delay: 1.2 }}
              >
                <Image
                  src="images/tilt-card/signature-white.svg"
                  alt="Signature"
                  width={250}
                  height={250}
                  priority
                />
              </motion.div>

              {/* SPOTLIGHT EFFECT */}
              <div className="card__spotlight" />

              {/* Border for front face */}
              <div className="absolute inset-0 border-[5px] border-white/30 rounded-2xl pointer-events-none shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
