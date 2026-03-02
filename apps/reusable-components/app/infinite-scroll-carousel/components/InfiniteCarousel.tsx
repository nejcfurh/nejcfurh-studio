/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Card from './Card';
import { animate, useMotionValue } from 'motion/react';
import useMeasure from 'react-use-measure';
import AnimatedDiv from '@/components/animation-core/AnimatedDiv';
import { FaSpinner } from 'react-icons/fa6';

const API_ADDRESS = 'https://spotify-api-wrapper.appspot.com';
const ARTIST_QUERY = 'Coldplay';

const InfiniteCarousel = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<{ artist: string; tracks: [] } | null>(
    null
  );

  const [mustFinishAnimation, setMustFinishAnimation] = useState(false);
  const [reRender, setReRender] = useState(false);

  const FAST_DURATION = 35;
  const SLOW_DURATION = 75;

  const [duration, setDuration] = useState(FAST_DURATION);

  const [ref, { width }] = useMeasure();
  const xTranslate = useMotionValue(0);

  useEffect(() => {
    let controls;
    const finalPosition = -width / 2 - 8;

    if (mustFinishAnimation) {
      controls = animate(xTranslate, [xTranslate.get(), finalPosition], {
        duration: duration * (1 - xTranslate.get() / finalPosition),
        onComplete: () => {
          setMustFinishAnimation(false);
          setReRender(!reRender);
        },
        ease: 'linear',
      });
    } else {
      controls = animate(xTranslate, finalPosition, {
        duration: duration,
        ease: 'linear',
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
      });
    }

    return () => controls?.stop();
  }, [xTranslate, duration, mustFinishAnimation, reRender, width]);

  const fetchItems = async () => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${API_ADDRESS}/artist/${ARTIST_QUERY}`);
    const data = await response.json();

    const artist = data.artists.items[0];

    const tracks = await fetch(`${API_ADDRESS}/artist/${artist.id}/top-tracks`);
    const tracksData = await tracks.json();

    setItems({ artist: artist.name, tracks: tracksData.tracks });
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchItems();
      } catch (error) {
        setError(error as string);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="font-bold text-white mx-auto flex items-center justify-center py-32 animate-spin">
        <FaSpinner className="size-20" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-5xl w-full text-center font-bold text-white py-32">
        Error: {error}
      </div>
    );
  }

  return (
    <AnimatedDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: 'easeInOut' }}
      className="py-20 relative overflow-hidden w-screen h-screen"
    >
      {items && (
        <AnimatedDiv
          ref={ref}
          style={{ x: xTranslate }}
          className="absolute left-0 flex gap-4 justify-center"
          onHoverStart={() => {
            setDuration(SLOW_DURATION);
            setMustFinishAnimation(true);
          }}
          onHoverEnd={() => {
            setDuration(FAST_DURATION);
            setMustFinishAnimation(false);
          }}
        >
          {[...items?.tracks, ...items?.tracks].map(
            (track: any, index: number) => (
              <Card key={index} track={track} />
            )
          )}
        </AnimatedDiv>
      )}
    </AnimatedDiv>
  );
};

export default InfiniteCarousel;
