import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import DomeraHeader from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { appConfig } from '@/config/app.config';
import { AuthProvider } from '@/features/auth/providers/AuthProvider';
import { AnalyticsProvider } from '@analytics/providers/AnalyticsProvider';
import { AnalyticsPostHogConfig } from '@analytics/services/posthog/types';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Domera | Find a house. Make it your home.',
  description: 'Find a house. Make it your home.',
  openGraph: {
    title: 'Domera | Find a house. Make it your home.',
    description: 'Find a house. Make it your home.',
    images: [
      {
        url: 'og.jpg'
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
    <html lang="en">
      <AnalyticsProvider posthogConfig={posthogConfig}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthProvider>
            <DomeraHeader />
            {children}
            <Toaster position="bottom-center" richColors closeButton />
          </AuthProvider>
        </body>
      </AnalyticsProvider>
    </html>
  );
}
