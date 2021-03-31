const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [
    [
      require.resolve('@dawnjs/babel-preset-dawn'),
      {
        typescript: false,
        env: { modules: 'auto' },
        react: { development: true },
      },
    ],
  ],
  babelrc: false,
  configFile: false,
});
