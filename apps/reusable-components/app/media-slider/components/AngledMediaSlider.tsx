'use client';

import { MEDIA_SLIDER_DATA } from '@/features/media-slider/constants';
import { computeClip } from '@/features/media-slider/utils';
import { useState } from 'react';

const AngledMediaSlider = ({
  enableText = false
}: {
  enableText?: boolean;
}) => {
  const videos = MEDIA_SLIDER_DATA;
  const [hovered, setHovered] = useState<number | null>(null);
  const split = 50;
  const count = videos.length;
  const pps = 100 / count;

  return (
    <ul className="slidey with-text relative m-0 grid h-full w-full list-none p-0">
      {videos.map((video, idx) => {
        const fgStyles = {
          width: `calc(100% - ${(count + 1) * split * 2}px)`,
          marginLeft: `${(idx + 1) * split * 2}px`
        };

        return (
          <li
            key={video.url}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            style={{ clipPath: computeClip(idx, hovered, pps, split, count) }}
            className="relative outline-none"
          >
            <div className="background absolute top-0 left-0 h-full w-full">
              <video
                className="h-full w-full object-cover"
                muted
                autoPlay
                loop
                src={video.url}
              />
            </div>
            {enableText && (
              <div className="foreground absolute top-0 left-0 h-full w-full">
                <div
                  className="fg_content relative flex h-full w-full items-center justify-end pr-10"
                  style={fgStyles}
                >
                  <h1 className="m-0 whitespace-nowrap">{video.content}</h1>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default AngledMediaSlider;
