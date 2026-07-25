import type { Metadata, Viewport } from 'next';
import { Roboto } from 'next/font/google';

import Providers from './providers';

import './globals.css';

// Self-hosted so the kiosk renders text without reaching fonts.googleapis.com.
const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin']
});

const TITLE = 'Desktop Weather | Current conditions at a glance';
const DESCRIPTION =
  'A kiosk weather display for a wall-mounted tablet, showing the current conditions alongside a seven day forecast.';

// Vercel provides VERCEL_URL per deployment, so the app needs no root-url of
// its own to resolve the relative asset paths below against.
const webRootUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(webRootUrl),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: '/icon-512.png'
      }
    ]
  },
  manifest: '/manifest.json',
  icons: {
    apple: '/icon-192.png'
  },
  // capable is what lets the Surface install this as a standalone kiosk app
  // rather than a browser tab; Next emits mobile-web-app-capable from it.
  appleWebApp: {
    capable: true,
    title: 'Desktop Weather',
    statusBarStyle: 'black-translucent'
  },
  // Next derives only the modern mobile-web-app-capable from appleWebApp and
  // never emits the Apple-prefixed name, so it is restored by hand: it is the
  // one tag the previous hand-written head carried that the metadata drops.
  other: {
    'apple-mobile-web-app-capable': 'yes'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} h-screen overflow-hidden bg-black font-sans text-white antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
