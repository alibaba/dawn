module.exports = {
  extends: [
    require.resolve('eslint-config-ali/es6'),
    require.resolve('eslint-config-prettier/standard'),
  ],
  // JS 项目使用 babel-eslint 做 parser
  parser: 'babel-eslint',
};
