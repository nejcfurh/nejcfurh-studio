import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  test: {
    environment: 'jsdom',
    include: ['**/*.test.{ts,tsx}'],
    setupFiles: ['./vitest.setup.ts'],
    // pnpm gives react-hook-form its own nested react copy. Left external it
    // resolves that copy through Node, so its hooks read from a second React
    // instance and return null. Inlining routes it through the dedupe above.
    server: {
      deps: {
        inline: ['react-hook-form']
      }
    }
  }
});
