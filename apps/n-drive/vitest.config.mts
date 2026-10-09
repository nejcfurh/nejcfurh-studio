import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'edge-runtime',
    include: ['convex/**/*.test.ts'],
    server: { deps: { inline: ['convex-test'] } },
    env: {
      CLERK_WEBHOOK_SECRET: 'whsec_bi1kcml2ZS1jb252ZXgtdGVzdC13ZWJob29rLWtleSE='
    }
  }
});
