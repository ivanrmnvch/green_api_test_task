import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript ESLint правила
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-undef': 'off', // TypeScript сам проверяет неопределенные переменные

      // Стиль кода по аналогии с Prettier-конфигом
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'quote-props': ['error', 'as-needed'],
      'comma-dangle': ['error', 'always-multiline'],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
];
