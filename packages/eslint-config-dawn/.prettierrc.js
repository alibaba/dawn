// See more: https://prettier.io/docs/en/options.html

module.exports = {
  useTabs: false,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      options: {
        singleQuote: false,
      },
    },
    {
      files: '.editorconfig',
      options: { parser: 'yaml' },
    },
  ],
  jsxSingleQuote: false,
  trailingComma: 'all',
  quoteProps: 'as-needed',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  requirePragma: false,
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  printWidth: 120,
};
