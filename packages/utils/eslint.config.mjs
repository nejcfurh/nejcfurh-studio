import { createBaseConfig } from 'eslint-config-web/react-library.js';

export default [
  ...createBaseConfig(import.meta.dirname),
  {
    ignores: [
      '**/__tests__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      'eslint.config.mjs',
      'postcss.config.js',
      // One-line date-fns re-export: import-x's export-map walker overflows
      // the call stack on date-fns' huge re-export graph.
      'src/date-fns.ts'
    ]
  }
];
