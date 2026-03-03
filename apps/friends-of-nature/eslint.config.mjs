import { createBaseConfig } from 'eslint-config-web';

const eslintConfig = [
  ...createBaseConfig(),
  {
    ignores: ['eslint.config.mjs', 'postcss.config.mjs']
  }
];

export default eslintConfig;
