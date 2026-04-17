import type { Metadata, Viewport } from 'next';
import { Nunito, Sora } from 'next/font/google';

import './globals.css';

import { appConfig } from '@/config/app.config';
import { AnalyticsProvider } from '@analytics/providers/AnalyticsProvider';
import { AnalyticsPostHogConfig } from '@analytics/services/posthog/types';

const sora = Sora({
  variable: '--font-sora',
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap'
});

const nunito = Nunito({
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800', '900'],
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Backyard Skies — Wings of Survival',
  description:
    'A 3D survival game where you fly as a bird between feeders in a suburban world. Choose your species and survive!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Backyard Skies'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#0a1628'
};

const posthogConfig: AnalyticsPostHogConfig = {
  apiKey: appConfig.posthog.apiKey,
  apiHost: appConfig.posthog.apiHost,
  superProperties: {
    environment: appConfig.env,
    serviceName: appConfig.serviceName,
    version: appConfig.version
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AnalyticsProvider posthogConfig={posthogConfig}>
        <head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, viewport-fit=cover"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="black-translucent"
          />
        </head>
        <body className={`${sora.variable} ${nunito.variable} antialiased`}>
          {children}
        </body>
      </AnalyticsProvider>
    </html>
  );
}
