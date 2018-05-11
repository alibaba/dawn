const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [
    require('babel-preset-env'),
    require('babel-preset-react')
  ],
  babelrc: false
});
