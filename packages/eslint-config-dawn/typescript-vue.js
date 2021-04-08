module.exports = {
  extends: [
    require.resolve('eslint-config-ali/typescript/vue'),
    require.resolve('./base'),
    require.resolve('./typescript-base'),
    require.resolve('./vue-base'),
  ],
};
