module.exports = resolve => ({
  collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
  testMatch: [
    '**/__tests__/**/*.{js,jsx,mjs}',
    '**/test/unit/**/*.{js,jsx,mjs}',
    '**/?(*.)(spec|test).{js,jsx,mjs}'
  ],
  // where to search for files/tests
  testEnvironment: 'node',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.(js|jsx|mjs)$': resolve('lib/babelTransform.js')
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$',
    '^.+\\.module\\.css$'
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '^.+\\.module\\.css$': 'identity-obj-proxy'
  },
  moduleFileExtensions: [
    'web.js',
    'mjs',
    'js',
    'json',
    'web.jsx',
    'jsx',
    'node'
  ]
});
