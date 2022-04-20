module.exports = {
  plugins: [require.resolve('@prettier/plugin-pug')],
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'consistent',
  jsxSingleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: false,
  bracketSameLine: false,
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'css',
  endOfLine: 'lf',
  pugSingleQuote: false,
  pugAttributeSeparator: 'always',
  pugSortAttributes: 'as-is',
  pugCommentPreserveSpaces: 'trim-all',
  pugClassNotation: 'as-is',
  pugClassLocation: 'before-attributes',
  pugIdNotation: 'as-is',
  pugWrapAttributesThreshold: -1,

  overrides: [
    {
      files: ['*.scss'],
      options: {
        singleQuote: false,
      },
    },
  ],
};

/*
pugIdNotation: 'attribute',


*/
