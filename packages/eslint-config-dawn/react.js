module.exports = {
  extends: [
    require.resolve('eslint-config-ali/react'),
    require.resolve('eslint-config-ali/jsx-a11y'),
    require.resolve('./base'),
    require.resolve('./react-base'),
  ],
};
