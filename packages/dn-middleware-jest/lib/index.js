/* eslint-disable max-statements */
/* eslint-disable no-undef */
const path = require('path');
const fs = require('fs');
const jest = require('jest');
const createDefaultConfig = require('./createJestConfig');

module.exports = (opts) => {
  return async (next, ctx) => {
    process.env.NODE_ENV = 'test';
    process.env.BABEL_ENV = 'test';

    const argv = [];
    if (opts && Array.isArray(opts.argv)) {
      argv.push(...opts.argv);
    }

    // Read config from cwd/jest.config.js
    const userJestConfigFile = path.join(ctx.cwd, 'jest.config.js');
    let userJestConfig = {};
    if (fs.existsSync(userJestConfigFile)) {
      ctx.console.info('[jest] load user config from cwd/jest.config.js');
      userJestConfig = require(userJestConfigFile);
    }

    // Read jest config from package.json
    let pkgJestConfig = {};
    if (ctx.project && ctx.project.jest) {
      ctx.console.info('[jest] load user config from package.json');
      pkgJestConfig = ctx.project.jest;
    }

    const config = Object.assign(
      {},
      createDefaultConfig(),
      pkgJestConfig,
      userJestConfig
    );
    argv.push(`--config=${JSON.stringify(config)}`);

    if (opts.watch) argv.push('--watch');
    if (opts.watchAll) argv.push('--watchAll');
    if (opts.coverage !== false) argv.push('--coverage');
    if (opts.debug || process.env.DN_DEBUG) argv.push('--debug');
    if (opts.silent) argv.push('--silent');

    try {
      ctx.console.info('[jest] start running unit test...');
      await jest.run(argv);
    } catch (error) {
      ctx.console.error(
        '[jest] test failed, see more: https://facebook.github.io/jest/docs/en/getting-started.htm'
      );
      throw error;
    }

    return next();
  };
};
