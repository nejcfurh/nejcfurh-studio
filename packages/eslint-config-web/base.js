import { resolve } from 'node:path';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import-x';
import prettierConfig from 'eslint-config-prettier';

export function createBaseConfig(cwd = process.cwd()) {
  const project = resolve(cwd, 'tsconfig.json');

  return tseslint.config(
    {
      ignores: [
        '**/node_modules/**',
        '**/coverage/**',
        '**/dist/**',
        '**/.turbo/**',
        '**/.next/**'
      ]
    },
    ...tseslint.configs.recommended,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    prettierConfig,
    {
      languageOptions: {
        parserOptions: {
          project
        }
      },
      settings: {
        'import-x/resolver': {
          typescript: { project },
          node: {
            extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx']
          }
        }
      },
      rules: {
        'no-duplicate-imports': 'off',
        'import-x/no-duplicates': 'error',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'require-unicode-regexp': 'off'
      }
    }
  );
}

export default createBaseConfig();
