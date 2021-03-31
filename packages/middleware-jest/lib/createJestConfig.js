module.exports = () => ({
  collectCoverageFrom: [
    'index.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/typings/**',
    '!**/types/**',
    '!**/fixtures/**',
    '!**/examples/**',
    '!**/*.d.ts'
  ],
  testMatch: ['**/?*.(test|spec|e2e).(j|t)s?(x)'],
  testEnvironment: require.resolve('jest-environment-jsdom-fourteen'),
  testPathIgnorePatterns: ['/node_modules/', '/fixtures/'],
  transform: {
    '^.+\\.(js|jsx|mjs)$': require.resolve(
      '../helpers/transformers/javascript'
    ),
    '^.+\\.(ts|tsx)$': require.resolve(
      '../helpers/transformers/typescript'
    ),
    '^.+\\.(css|less|sass|scss|stylus)$': require.resolve(
      '../helpers/transformers/css'
    ),
    '^(?!.*\\.(js|jsx|ts|tsx|css|less|sass|scss|stylus|json)$)': require.resolve(
      '../helpers/transformers/file'
    )
  },
  transformIgnorePatterns: [
    // '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$',
    // '^.+\\.module\\.css$'
  ],
  setupFiles: [require.resolve('../helpers/setupFiles/shim')],
  setupFilesAfterEnv: [require.resolve('../helpers/setupFiles/jasmine')],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '\\.(css|less|sass|scss|stylus)$': 'identity-obj-proxy'
  },
  moduleFileExtensions: [
    'web.js',
    'mjs',
    'js',
    'json',
    'web.jsx',
    'jsx',
    'ts',
    'tsx',
    'node'
  ],
  verbose: true
});
