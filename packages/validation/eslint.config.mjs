import { createBaseConfig } from 'eslint-config-web/react-library.js';

export default [
  ...createBaseConfig(import.meta.dirname),
  {
    ignores: ['eslint.config.mjs']
  }
];
