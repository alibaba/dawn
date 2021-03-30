const babelJest = require('babel-jest');
const { getBabelConfig } = require('dn-middleware-babel/lib/getBabelConfig');

module.exports = babelJest.createTransformer({
  ...getBabelConfig({
    env: 'development',
    target: 'browser',
    type: 'cjs',
    typescript: true,
    corejs: 3
  }),
  babelrc: false,
  configFile: false
});
