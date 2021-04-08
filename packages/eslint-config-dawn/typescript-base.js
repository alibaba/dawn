module.exports = {
  parser: require.resolve('@typescript-eslint/parser'),
  rules: {
    /**
     * 已经不再推荐使用 Namespace
     */
    '@typescript-eslint/no-namespace': 'warn',

    /**
     * 对空的接口 Interface 不做限制
     */
    '@typescript-eslint/no-empty-interface': 'off',

    /**
     * 强制新的和构造函数的有效定义
     * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-misused-new.md
     */
    '@typescript-eslint/no-misused-new': 'error',

    // 当不需要 namespace、type 时发出警告
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',

    /**
     * 如果索引仅用于访问正在迭代的数组，则建议首选“for of”循环，而不是标准“for”循环
     * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-for-of.md
     */
    '@typescript-eslint/prefer-for-of': 'warn',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implied-eval.md
    'no-implied-eval': 'off',
    '@typescript-eslint/no-implied-eval': 'error',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-throw-literal.md
    'no-throw-literal': 'off',
    '@typescript-eslint/no-throw-literal': 'warn',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
    camelcase: 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'variable',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
    ],
  },
};
