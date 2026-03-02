import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import AnimatedTitle from '@/components/animation-core/AnimatedTitle';
import { FaSpotify } from 'react-icons/fa6';
import AnimatedDiv from '@/components/animation-core/AnimatedDiv';

/* eslint-disable @typescript-eslint/no-explicit-any */
const Card = ({ track }: { track: any }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <AnimatedDiv
      onHoverStart={() => setShowOverlay(true)}
      onHoverEnd={() => setShowOverlay(false)}
      className="relative w-56 h-56 rounded-2xl overflow-hidden"
    >
      <AnimatePresence>
        {showOverlay && (
          <AnimatedDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center z-10 justify-center"
          >
            <div className="absolute w-full h-full bg-black/50 pointer-events-none" />
            <AnimatedTitle
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              exit={{ y: 10 }}
              transition={{ duration: 0.3 }}
              className="bg-white font-semibold text-sm rounded-full z-10 px-3 py-2 flex items-center gap-2 hover:opacity-75 text-black"
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
        className="w-full h-full object-cover"
      />
      <AnimatePresence>
        {!showOverlay && (
          <AnimatedDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent"
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
