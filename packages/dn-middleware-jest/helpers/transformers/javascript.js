const babelJest = require('babel-jest');
const { getBabelConfig } = require('dn-middleware-babel/lib/getBabelConfig');

module.exports = babelJest.createTransformer(
  getBabelConfig({
    env: 'test',
    target: 'node',
    type: 'cjs',
    typescript: true,
    corejs: 3
  })
);
