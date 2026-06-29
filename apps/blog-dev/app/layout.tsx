import Footer from '@/components/Footer';
import GrainOverlay from '@/components/GrainOverlay';
import Navbar from '@/components/Navbar';
import ScrollProgress from '@/components/ScrollProgress';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { cookies } from 'next/headers';

import './globals.css';

import { appConfig } from '@/config/app.config';
import { AnalyticsProvider } from '@analytics/providers/AnalyticsProvider';
import { AnalyticsPostHogConfig } from '@analytics/services/posthog/types';
import { easeOut } from '@repo/ui/animation';
import { AnimatedDiv } from '@repo/ui/animation/core';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Blog | <nejcfurh/>',
  description:
    'A personal dev blog by Nejc Furh — writing about code, projects, and lessons learned building for the web.'
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

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  // READ THE PERSISTED THEME ON THE SERVER SO `DATA-THEME` IS CORRECT IN THE INITIAL HTML
  const cookieStore = await cookies();
  const theme = cookieStore.get('theme')?.value === 'light' ? 'light' : 'dark';

  return (
    <html lang="en" data-theme={theme}>
      <AnalyticsProvider posthogConfig={posthogConfig}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} font-sans antialiased`}
        >
          <ThemeProvider initialTheme={theme}>
            {/* AMBIENT DEPTH + TEXTURE, RENDERED GLOBALLY BEHIND ALL SECTIONS AS ONE CONTINUOUS FIELD (NO PER-SECTION BACKGROUNDS). */}
            <ScrollProgress />
            <GrainOverlay />
            <AnimatedDiv
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: easeOut, delay: 1 }}
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
            >
              <div className="gradient-orb gradient-orb-accent absolute bottom-0 -left-32 h-[350px] w-[350px] sm:h-[440px] sm:w-[440px]" />
            </AnimatedDiv>

            <div className="relative z-10 flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 pt-24">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </body>
      </AnalyticsProvider>
    </html>
  );
}
