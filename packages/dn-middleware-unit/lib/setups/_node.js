const utils = require('ntils');

require('babel-core/register')({
  babelrc: true,
  cache: true,
  presets: [
    [require.resolve('babel-preset-env'), {
      targets: { node: 'current' }
    }]
  ],
  plugins: [
    require.resolve('babel-plugin-add-module-exports'),
    require.resolve('babel-plugin-typecheck'),
    require.resolve('babel-plugin-transform-decorators-legacy')
  ]
});

require('./_common');