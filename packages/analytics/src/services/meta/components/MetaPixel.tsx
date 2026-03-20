'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import React, { useEffect, useRef, useState } from 'react';

import type {} from '../types';

// Local implementation to avoid import issues
const useIsMounted = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      setIsMounted(true);
    }
  }, []);

  return isMounted;
};

interface MetaPixelProps {
  pixelId: string;
  secondPixelId?: string;
}

export const MetaPixel = ({
  pixelId,
  secondPixelId
}: MetaPixelProps): React.JSX.Element => {
  const isMounted = useIsMounted();
  const pathname = usePathname();

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('init', pixelId);
      if (secondPixelId) {
        window.fbq('init', secondPixelId);
      }
      window.fbq('track', 'PageView');
    }
  }, [pathname, isMounted, pixelId, secondPixelId]);

  return (
    <React.Fragment>
      <Script id="fb-pixel" strategy="afterInteractive" data-pixel-id={pixelId}>
        {`
        function initializeFacebookPixel(f, b, e, v, n, t, s) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = "2.0";
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        }

        initializeFacebookPixel(
          window,
          document,
          "script",
          "https://connect.facebook.net/en_US/fbevents.js",
        );
        `}
      </Script>
      <Head>
        <noscript>
          <img
            height="1"
            width="1"
            src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
            alt="FB Pixel"
          />
          {secondPixelId && (
            <img
              height="1"
              width="1"
              src={`https://www.facebook.com/tr?id=${secondPixelId}&ev=PageView&noscript=1`}
              alt="FB Pixel"
            />
          )}
        </noscript>
      </Head>
    </React.Fragment>
  );
};
