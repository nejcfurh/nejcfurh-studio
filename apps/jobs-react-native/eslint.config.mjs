import { createBaseConfig } from 'eslint-config-web/react-library.js';

export default [
  ...createBaseConfig(import.meta.dirname),
  {
    ignores: ['eslint.config.mjs', 'babel.config.js']
  },
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'warn'
    }
  }
];
