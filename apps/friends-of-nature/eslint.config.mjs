import { createBaseConfig } from 'eslint-config-web';

const eslintConfig = [
  ...createBaseConfig(import.meta.dirname),
  {
    ignores: [
      'eslint.config.mjs',
      'postcss.config.mjs',
      'next-env.d.ts',
      'vitest.config.mts'
    ]
  }
];

export default eslintConfig;
