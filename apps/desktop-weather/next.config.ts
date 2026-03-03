import type { NextConfig } from 'next';

const baseConfig: NextConfig = {
  reactStrictMode: true,
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

// Only apply next-pwa for production builds (webpack).
// next-pwa is incompatible with Turbopack, so we avoid even importing it in dev.
let nextConfig: NextConfig = baseConfig;

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
    buildExcludes: [/middleware-manifest\.json$/],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'weather-api',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60, // 1 hour
          },
        },
      },
    ],
  });
  nextConfig = withPWA(baseConfig);
}

export default nextConfig;
