module.exports = {
  extends: [
    require.resolve('./standard'),
    require.resolve('eslint-config-ali/typescript'),
  ],
  parser: require.resolve('@typescript-eslint/parser'),
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: ['./tsconfig.json', './**/tsconfig.json'],
    projectFolderIgnoreList: ['/node_modules/'], // same as default
    warnOnUnsupportedTypeScriptVersion: true, // same as default
    createDefaultProgram: false, // same as default
  },
  rules: {
    /**
     * 缩进规则 follow standard
     */
    indent: 'off',
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
        ignoredNodes: [
          'JSXElement',
          'JSXElement > *',
          'JSXAttribute',
          'JSXIdentifier',
          'JSXNamespacedName',
          'JSXMemberExpression',
          'JSXSpreadAttribute',
          'JSXExpressionContainer',
          'JSXOpeningElement',
          'JSXClosingElement',
          'JSXFragment',
          'JSXOpeningFragment',
          'JSXClosingFragment',
          'JSXText',
          'JSXEmptyExpression',
          'JSXSpreadChild',
        ],
        ignoreComments: false,
      },
    ],

    /**
     * 当模块内只有一个 export 时，使用 default export，TS 项目不推荐这样
     */
    'import/prefer-default-export': 'off',

    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: false, variables: false },
    ],

    /**
     * 已经不再推荐使用 Namespace
     */
    '@typescript-eslint/no-namespace': 'warn',

    /**
     * 对空的接口 Interface 不做限制
     */
    '@typescript-eslint/no-empty-interface': 'off',

    /**
     * 强制使用双引号
     */
    quotes: 'off',
    '@typescript-eslint/quotes': [
      'error',
      'double',
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],

    /**
     * 建议类型声明周围的间距
     * 使用规则默认的 options
     * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/type-annotation-spacing.md
     */
    '@typescript-eslint/type-annotation-spacing': 'error',

    /**
     * 建议要求与类型定义（接口或类型）一致
     * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/consistent-type-definitions.md
     */
    '@typescript-eslint/consistent-type-definitions': 'warn',

    /**
     * 接口内成员的分隔符必须是分号
     * https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/member-delimiter-style.md
     */
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'semi',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],

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
  },
};
