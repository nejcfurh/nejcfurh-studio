import type { NextConfig } from 'next';

const supabaseHostname = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      ...(supabaseHostname
        ? [
            {
              protocol: 'https' as const,
              hostname: supabaseHostname,
              pathname: '/storage/v1/object/public/**'
            }
          ]
        : []),
      { protocol: 'https' as const, hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https' as const, hostname: 'firebasestorage.googleapis.com' }
    ]
  }
};

export default nextConfig;
