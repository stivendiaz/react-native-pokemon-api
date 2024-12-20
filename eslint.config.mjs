import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'], // Target JavaScript and TypeScript files
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tsParser, // Use the imported TypeScript parser
    },
    plugins: {
      react: reactPlugin,
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...prettier.rules, // Disable conflicting ESLint rules
      'prettier/prettier': 'warn', // Show Prettier issues as warnings
    },
  },
];
