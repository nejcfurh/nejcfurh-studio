'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from 'lib/utils';

const BackgroundVideo = ({
  isMuted = true,
  isLooping = true,
  className,
  mobileVideoPath,
  mobileWebmPath,
  desktopVideoPath,
  desktopWebmPath,
  desktopVideoHeight,
  isObjectFitCover = true,
  objectPosition,
  playDelay = 0 // Delay in seconds before autoplay starts
}: {
  isMuted?: boolean;
  isLooping?: boolean;
  className?: string;
  mobileVideoPath: string;
  mobileWebmPath?: string;
  desktopVideoPath: string;
  desktopWebmPath?: string;
  desktopVideoHeight?: string | number;
  isObjectFitCover?: boolean;
  objectPosition?: string;
  playDelay?: number; // New prop for autoplay delay
}): React.ReactNode => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const handleResize = (): void => {
      setIsMobile(window.innerWidth <= 768);
    };

    const detectAndroid = (): void => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;

      setIsAndroid(/android/i.test(userAgent));
    };

    handleResize();
    detectAndroid();

    window.addEventListener('resize', handleResize);

    return (): void => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (videoRef.current && playDelay >= 0) {
      const timer = setTimeout(() => {
        videoRef.current?.play().catch((err) => {
          console.error('Video playback failed:', err);
        });
      }, playDelay * 1000); // Convert seconds to milliseconds

      return (): void => clearTimeout(timer);
    }
  }, [isMobile, playDelay]);

  if (isMobile === null) {
    return null;
  }

  let videoSources: (string | undefined)[] = [];

  if (isMobile) {
    videoSources = isAndroid
      ? [mobileWebmPath, mobileVideoPath]
      : [mobileVideoPath];
  } else {
    videoSources = isAndroid
      ? [desktopWebmPath, desktopVideoPath]
      : [desktopVideoPath];
  }

  return (
    <div className={cn('h-full w-full scrollbar-hide', className)}>
      <video
        ref={videoRef}
        className="h-full w-full"
        loop={isLooping}
        muted={isMuted}
        playsInline
        style={{
          height: desktopVideoHeight && !isMobile ? desktopVideoHeight : '100%',
          width: '100%',
          maxHeight: '100%',
          objectFit: isObjectFitCover ? 'cover' : undefined,
          objectPosition: objectPosition || undefined,
          backgroundColor: 'transparent'
        }}
      >
        {videoSources.map(
          (source, index) =>
            source && (
              <source
                key={index}
                src={source}
                type={source.endsWith('.webm') ? 'video/webm' : 'video/mp4'}
              />
            )
        )}
        <track kind="captions" />
      </video>
    </div>
  );
};

export default BackgroundVideo;
