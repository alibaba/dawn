require('./_node');
require('ts-node').register({
  compilerOptions: {
    moduleResolution: 'node',
    allowJs: true,
    module: 'commonjs',
    target: 'es2017',
    esModuleInterop: true,
    types: [
      'node',
      'mocha',
      'chai',
      'supertest'
    ]
  }
});