import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb'
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co'
      },
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  }
};

export default nextConfig;
