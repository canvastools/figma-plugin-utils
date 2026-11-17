import js from '@eslint/js'
import figmaPlugins from '@figma/eslint-plugin-figma-plugins'
import { defineConfig, globalIgnores } from 'eslint/config'
import tseslint from 'typescript-eslint'

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
      // Types are erased by the bundler one file at a time, so they are imported as types.
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          // `const { visible, ...rest } = item` takes a property out of an object.
          ignoreRestSiblings: true,
        },
      ],
    },
  },
])
