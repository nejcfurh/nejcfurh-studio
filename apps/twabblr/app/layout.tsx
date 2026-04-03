import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import AuthContext from './context/AuthContext';
import QueryContext from './context/QueryContext';
import ToasterContext from './context/ToasterContext';

import './globals.css';

import { appConfig } from '@/config/app.config';
import { AnalyticsProvider } from '@analytics/providers/AnalyticsProvider';
import { AnalyticsPostHogConfig } from '@analytics/services/posthog/types';

import ActiveStatus from './components/ActiveStatus';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'twabblr | Chat anywhere!',
  description: 'twabblr - Messenger Clone Application'
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
        <body className={inter.className}>
          <AuthContext>
            <QueryContext>
              <ToasterContext />
              <ActiveStatus />
              {children}
            </QueryContext>
          </AuthContext>
        </body>
      </AnalyticsProvider>
    </html>
  );
}
