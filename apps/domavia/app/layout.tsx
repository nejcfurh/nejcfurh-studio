import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import DomaviaFooter from '@/components/Footer';
import DomaviaHeader from '@/components/Header';
import { appConfig } from '@/config/app.config';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { AnalyticsProvider } from '@analytics/providers/AnalyticsProvider';
import { AnalyticsPostHogConfig } from '@analytics/services/posthog/types';
import { Toaster } from '@repo/ui/components/sonner';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.webRootUrl),
  title: 'Domavia | Find a house. Make it your home.',
  description: 'Find a house. Make it your home.',
  openGraph: {
    title: 'Domavia | Find a house. Make it your home.',
    description: 'Find a house. Make it your home.',
    images: [
      {
        url: '/og.jpg'
      }
    ]
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

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <AnalyticsProvider posthogConfig={posthogConfig}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthProvider>
            <DomaviaHeader />
            {children}
            <DomaviaFooter />
            <Toaster position="bottom-center" richColors closeButton />
          </AuthProvider>
        </body>
      </AnalyticsProvider>
    </html>
  );
}
