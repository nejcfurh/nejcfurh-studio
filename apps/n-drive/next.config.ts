import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'elegant-marmot-650.convex.cloud',
        pathname: '/api/storage/**'
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '/**'
      }
    ]
  }
};

export default nextConfig;
