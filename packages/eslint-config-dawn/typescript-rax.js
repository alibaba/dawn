module.exports = {
  extends: [
    require.resolve('eslint-config-ali/typescript/rax'),
    require.resolve('./base'),
    require.resolve('./typescript-base'),
  ],
  settings: {
    // Apply special parsing for TypeScript files
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
    },
    // Append 'tsx' extensions to 'import/resolver' setting
    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.ts', '.json', '.jsx', '.tsx'],
      },
    },
    // Append 'tsx' extensions to 'import/extensions' setting
    'import/extensions': ['.js', '.ts', '.mjs', '.jsx', '.tsx'],
  },
};
