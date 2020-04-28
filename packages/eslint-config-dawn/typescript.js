module.exports = {
  extends: [
    require.resolve('eslint-config-ali/typescript'),
    require.resolve('./standard'),
    require.resolve('eslint-config-prettier/@typescript-eslint'),
  ],
  parser: require.resolve('@typescript-eslint/parser'),
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: './tsconfig.json',
    projectFolderIgnoreList: ['/node_modules/'], // same as default
    warnOnUnsupportedTypeScriptVersion: true, // same as default
    createDefaultProgram: false, // same as default
  },
  settings: {
    // Apply special parsing for TypeScript files
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.d.ts'],
    },
    // Append 'ts' extensions to 'import/resolver' setting
    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.ts', '.json'],
      },
    },
    // Append 'ts' extensions to 'import/extensions' setting
    'import/extensions': ['.js', '.ts', '.mjs'],
  },
  rules: {
    /**
     * 当模块内只有一个 export 时，使用 default export，TS 项目不推荐这样
     */
    'import/prefer-default-export': 'off',

    /**
     * 已经不再推荐使用 Namespace
     */
    '@typescript-eslint/no-namespace': 'warn',

    /**
     * 对空的接口 Interface 不做限制
     */
    '@typescript-eslint/no-empty-interface': 'off',

    /**
     * 建议要求与类型定义（接口或类型）一致
     * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-definitions.md
     */
    '@typescript-eslint/consistent-type-definitions': 'warn',

    /**
     * 强制新的和构造函数的有效定义
     * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-misused-new.md
     */
    '@typescript-eslint/no-misused-new': 'error',

    /**
     * 不推荐给 this 起别名
     * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-this-alias.md
     */
    '@typescript-eslint/no-this-alias': 'warn',

    // 当不需要 namespace、type 时发出警告
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',

    /**
     * 如果索引仅用于访问正在迭代的数组，则建议首选“for of”循环，而不是标准“for”循环
     * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/prefer-for-of.md
     */
    '@typescript-eslint/prefer-for-of': 'warn',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-array-constructor.md
    'no-array-constructor': 'off',
    '@typescript-eslint/no-array-constructor': 'error',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-dupe-class-members.md
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-dupe-class-members': 'error',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': [
      'error',
      {
        allow: ['arrowFunctions', 'functions', 'methods'],
      },
    ],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implied-eval.md
    'no-implied-eval': 'off',
    '@typescript-eslint/no-implied-eval': 'error',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-throw-literal.md
    'no-throw-literal': 'off',
    '@typescript-eslint/no-throw-literal': 'warn',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
    'no-unused-vars': 'off',
    // '@typescript-eslint/no-unused-vars': '', has been set correctly in eslint-config-ali/typescript

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false, variables: false }],

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-useless-constructor.md
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',

    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/camelcase.md
    camelcase: 'off',
    '@typescript-eslint/camelcase': [
      'error',
      { properties: 'never', ignoreDestructuring: false, ignoreImports: false, genericType: 'never' },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // Disable `no-undef` rule within TypeScript files because it incorrectly errors when exporting default interfaces
        // https://github.com/iamturns/eslint-config-airbnb-typescript/issues/50
        // This will be caught by TypeScript compiler if `strictNullChecks` (or `strict`) is enabled
        'no-undef': 'off',

        /* Using TypeScript makes it safe enough to disable the checks below */

        // Disable ESLint-based module resolution check for improved monorepo support
        // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
        'import/no-unresolved': 'off',
      },
    },
  ],
};
