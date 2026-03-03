import { NextResponse } from 'next/server';

export async function GET() {
  // Get deployment info from environment variables or generate a unique version
  const deploymentVersion =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_BUILD_ID ||
    `build-${Date.now()}`;

  const deploymentInfo = {
    version: deploymentVersion,
    timestamp: Date.now(),
    environment: process.env.NODE_ENV,
    // Add Vercel deployment info if available
    vercelUrl: process.env.VERCEL_URL,
    gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA,
  };

  return NextResponse.json(deploymentInfo, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}
