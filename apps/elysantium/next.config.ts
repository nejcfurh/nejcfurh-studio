import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zfzxflfhxkzkggphkmqz.supabase.co'
      }
    ]
  }
};

export default nextConfig;
