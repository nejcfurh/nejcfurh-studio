import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import './globals.css';

import { appConfig } from '@/config/app.config';
import { AnalyticsProvider } from '@analytics/providers/AnalyticsProvider';
import { AnalyticsPostHogConfig } from '@analytics/services/posthog/types';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'Elysantium Hotel | Luxury Hotel Resort',
  description:
    'Elysantium Hotel is a luxury hotel experience in the heart of the city. It is a place where you can relax and enjoy your stay.',
  keywords: ['hotel', 'luxury', 'experience', 'city', 'relax', 'enjoy'],
  authors: [
    { name: 'Elysantium Hotel', url: 'https://elysantium.nejcfurh.dev' }
  ],
  openGraph: {
    title: 'Elysantium Hotel | Luxury Hotel Resort',
    description:
      'Elysantium Hotel is a luxury hotel experience in the heart of the city. It is a place where you can relax and enjoy your stay.',
    url: 'https://elysantium.nejcfurh.dev',
    siteName: 'Elysantium Hotel'
  }
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AnalyticsProvider posthogConfig={posthogConfig}>
        <body className={`${poppins.variable} font-[Poppins,sans-serif]`}>
          {children}
        </body>
      </AnalyticsProvider>
    </html>
  );
}
