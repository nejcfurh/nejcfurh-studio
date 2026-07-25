import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';

import Providers from './providers';

import './globals.css';

// Self-hosted so the kiosk renders text without reaching fonts.googleapis.com.
const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Desktop Weather',
  description: 'Desktop Weather'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${roboto.variable} h-screen overflow-hidden bg-black font-sans text-white antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
