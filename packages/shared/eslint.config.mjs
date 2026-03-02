import { createBaseConfig } from 'eslint-config-web/react-library.js';

export default [
  ...createBaseConfig(),
  {
    ignores: [
      '**/__tests__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      'eslint.config.mjs',
      'postcss.config.js'
    ]
  }
];
