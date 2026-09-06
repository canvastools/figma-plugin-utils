import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import figmaPlugins from '@figma/eslint-plugin-figma-plugins'

export default defineConfig([
  // Build-time Node files: they run outside the plugin sandbox, so the
  // Figma/browser globals this config assumes do not apply to them.
  globalIgnores(['dist', 'node_modules', 'vite.config.js', 'scripts']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: { '@figma/figma-plugins': figmaPlugins },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      ...figmaPlugins.flatConfigs.recommended.rules,
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
])
