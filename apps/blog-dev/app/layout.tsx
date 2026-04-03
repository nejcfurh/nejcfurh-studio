import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';

import { appConfig } from '@/config/app.config';
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
  title: 'Blog.dev',
  description:
    'A blog built with Next.js, MongoDB, and Tailwind CSS. Create, read, and manage blog posts.'
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
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </body>
      </AnalyticsProvider>
    </html>
  );
}
