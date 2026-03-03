import AnimatedDiv from '@/components/animation-core/AnimatedDiv';
import AnimatedTitle from '@/components/animation-core/AnimatedTitle';
import { AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { useState } from 'react';
import { FaSpotify } from 'react-icons/fa6';

/* eslint-disable @typescript-eslint/no-explicit-any */
const Card = ({ track }: { track: any }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <AnimatedDiv
      onHoverStart={() => setShowOverlay(true)}
      onHoverEnd={() => setShowOverlay(false)}
      className="relative h-56 w-56 overflow-hidden rounded-2xl"
    >
      <AnimatePresence>
        {showOverlay && (
          <AnimatedDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <div className="pointer-events-none absolute h-full w-full bg-black/50" />
            <AnimatedTitle
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              exit={{ y: 10 }}
              transition={{ duration: 0.3 }}
              className="z-10 flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-black hover:opacity-75"
            >
              <a
                href={track.external_urls?.spotify || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <span>Explore on Spotify</span>
                <FaSpotify />
              </a>
            </AnimatedTitle>
          </AnimatedDiv>
        )}
      </AnimatePresence>

      <Image
        src={track.album.images[0].url}
        alt={track.name}
        width={1000}
        height={1000}
        className="h-full w-full object-cover"
      />
      <AnimatePresence>
        {!showOverlay && (
          <AnimatedDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/90 to-transparent p-4"
          >
            <h2 className="text-xs font-semibold">{track.name}</h2>
            <p className="text-sm text-white">{track.artists[0].name}</p>
          </AnimatedDiv>
        )}
      </AnimatePresence>
    </AnimatedDiv>
  );
};

export default Card;
