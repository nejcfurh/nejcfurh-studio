import { createBaseConfig } from 'eslint-config-web/react-library.js';

export default [
  ...createBaseConfig(import.meta.dirname),
  {
    ignores: [
      '**/__tests__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      'eslint.config.mjs',
      'postcss.config.js'
    ]
  },
  {
    // Vendored shadcn/ui components follow upstream style (no explicit
    // return types) so they stay diffable against the shadcn registry.
    files: ['components/**'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off'
    }
  }
];
