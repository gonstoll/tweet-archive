/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['next/core-web-vitals'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {prefer: 'type-imports', fixStyle: 'inline-type-imports'},
    ],
    '@typescript-eslint/no-import-type-side-effects': 'error',
  },
}
