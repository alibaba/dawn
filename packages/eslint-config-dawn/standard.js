module.exports = {
  extends: [
    require.resolve('eslint-config-ali/es6'),
    require.resolve('eslint-config-prettier/standard'),
  ],
  env: {
    worker: true,
    serviceworker: true,
  },
  // JS 项目使用 babel-eslint 做 parser
  parser: require.resolve('babel-eslint'),
  rules: {
    /**
     * 建议同一文件中最多只有一个 class
     */
    'max-classes-per-file': ['warn', 1],

    /**
     * 禁止使用某些对象上的属性
     * https://eslint.org/docs/rules/no-restricted-properties
     */
    'no-restricted-properties': [
      'error',
      {
        object: 'arguments',
        property: 'callee',
        message: 'arguments.callee is deprecated',
      },
      {
        object: 'global',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'self',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'window',
        property: 'isFinite',
        message: 'Please use Number.isFinite instead',
      },
      {
        object: 'global',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      },
      {
        object: 'self',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      },
      {
        object: 'window',
        property: 'isNaN',
        message: 'Please use Number.isNaN instead',
      },
      {
        property: '__defineGetter__',
        message: 'Please use Object.defineProperty instead.',
      },
      {
        property: '__defineSetter__',
        message: 'Please use Object.defineProperty instead.',
      },
      {
        object: 'Math',
        property: 'pow',
        message: 'Use the exponentiation operator (**) instead.',
      },
    ],

    /**
     * 强制箭头函数函数体的风格
     * https://eslint.org/docs/rules/arrow-body-style
     */
    'arrow-body-style': [
      'error',
      'as-needed',
      {
        requireReturnForObjectLiteral: false,
      },
    ],

    /**
     * 当箭头函数只有一个参数时，可以省略括号。在所有其他情况下，参数必须用括号括起来。
     * https://eslint.org/docs/rules/arrow-parens
     */
    'arrow-parens': [
      'error',
      'as-needed',
      {
        requireForBlockBody: true,
      },
    ],

    /**
     * 强制使用模板字符串替代字符串拼接
     */
    'prefer-template': 'error',

    /**
     * 建议给 import 排序
     * https://eslint.org/docs/rules/sort-imports
     */
    'sort-imports': [
      'warn',
      {
        ignoreCase: false,
        ignoreDeclarationSort: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],

    // 类成员之间是否保留一个空行不做建议
    'lines-between-class-members': 'off',

    /**
     * 强制不能用 Buffer() 构造函数
     * https://eslint.org/docs/rules/no-buffer-constructor
     */
    'no-buffer-constructor': 'error',

    /**
     * 强制不允许在调用 require 时使用 new 操作符
     * https://eslint.org/docs/rules/no-new-require
     * @example
     * bad: new require('foo');
     */
    'no-new-require': 'error',

    /**
     * 不建议对 __dirname 和 __filename 进行字符串连接
     * https://eslint.org/docs/rules/no-path-concat
     */
    'no-path-concat': 'warn',

    /**
     * 使用有效的 jsdoc 注释
     */
    'valid-jsdoc': 'warn',

    /**
     * babel 会帮我们添加 `'use strict';`
     */
    strict: ['error', 'never'],

    /**
     * 不强制在数组开括号后和闭括号前换行
     */
    'array-bracket-newline': ['off', 'consistent'], // object option alternative: { multiline: true, minItems: 3 }

    /**
     * 建议小驼峰命名
     */
    camelcase: ['warn', { properties: 'never', ignoreDestructuring: false }],

    /**
     * 在文件末尾保留一行空行
     */
    'eol-last': ['error', 'always'],

    // this option sets a specific tab width for your code
    // https://eslint.org/docs/rules/indent
    indent: [
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
     * 单文件建议不要超过 1200 行
     */
    'max-lines': [
      'warn',
      {
        max: 1200,
        skipBlankLines: true,
        skipComments: true,
      },
    ],

    /**
     * 单方法建议不要超过 120 行
     */
    'max-lines-per-function': [
      'warn',
      {
        max: 120,
        skipBlankLines: true,
        skipComments: true,
        IIFEs: true,
      },
    ],

    /**
     * 单行建议不要超过 120 字符（特殊情况已排除）
     */
    'max-len': [
      'warn',
      120,
      2,
      {
        ignoreUrls: true,
        ignoreComments: false,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],

    /**
     * 单函数建议不要超过 6 个参数
     */
    'max-params': ['warn', 6],
  },
};
