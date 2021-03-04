require('./_node');
require('ts-node').register({
  compilerOptions: {
    allowJs: true,
    module: 'commonjs',
    target: 'es5',
    esModuleInterop: true,
    types: [
      'node',
      'mocha',
      'chai',
    ]
  }
});

const childProcess = require('child_process');
const fork = childProcess.fork;
childProcess.fork = function (modulePath, args, options) {
  const { execArgv } = options;
  if (modulePath.endsWith('.ts') &&
    !execArgv.some(item => item == 'ts-node/register')) {
    execArgv.unshift('ts-node/register');
    execArgv.unshift('-r');
  }
  return fork.call(childProcess, modulePath, args, options);
}
