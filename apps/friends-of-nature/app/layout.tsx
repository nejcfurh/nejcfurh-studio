import type { Metadata } from 'next';
import localFont from 'next/font/local';

import './globals.css';

import { AnalyticsProvider } from '@analytics/providers/AnalyticsProvider';
import { AnalyticsPostHogConfig } from '@analytics/services/posthog/types';

import { appConfig } from '@config/app.config';

const PPMoriRegular = localFont({
  src: '../public/fonts/PPMori-Regular.otf'
});

export const metadata: Metadata = {
  title: 'Friends of Nature',
  description: 'by Wonder'
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

const RootLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode => {
  return (
    <html lang="en">
      <AnalyticsProvider posthogConfig={posthogConfig}>
        <head>
          <link rel="stylesheet" href="https://use.typekit.net/piz6hxo.css" />
        </head>
        <body className={`bg-white antialiased ${PPMoriRegular.className}`}>
          {children}
        </body>
      </AnalyticsProvider>
    </html>
  );
};

export default RootLayout;
