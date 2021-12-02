module.exports = {
  parser: require.resolve('@babel/eslint-parser'),
  extends: [require.resolve('eslint-config-prettier')],
  plugins: ['prettier'],
  env: {
    worker: true,
    serviceworker: true,
  },
  rules: {
    /**
     * 开启 prettier 规则
     */
    'prettier/prettier': 'error',

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
     * 强制使用模板字符串替代字符串拼接
     */
    'prefer-template': 'error',

    /**
     * 建议给 import 排序，由于这个不能 autofix，所以设为 warn
     * https://eslint.org/docs/rules/sort-imports
     * @example
     * import 'foo';
     * import React from 'react';
     * import * as Bar from 'bar';
     * import { foo, bar } from 'some';
     */
    'sort-imports': [
      'warn',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false, // can be auto fixed
        memberSyntaxSortOrder: ['none', 'single', 'all', 'multiple'],
      },
    ],

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
     * babel 会帮我们添加 `'use strict';`
     */
    strict: ['error', 'never'],

    /**
     * 强制小驼峰命名
     */
    camelcase: ['error', { properties: 'never', ignoreDestructuring: false, ignoreImports: false }],

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
     * 单函数建议不要超过 6 个参数
     */
    'max-params': ['warn', 6],

    // 不建议使用嵌套的三元表达式
    'no-nested-ternary': 'warn',
  },
};
