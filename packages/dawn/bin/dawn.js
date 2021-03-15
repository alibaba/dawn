#!/usr/bin/env node

const resolveCwd = require('resolve-cwd');

const { name, bin } = require('../package.json');
const localCLI = resolveCwd.silent(`${name}/${bin.dawn}`);
if (!process.env.USE_GLOBAL_DAWN && localCLI && localCLI !== __filename) {
  const debug = require('debug')('dawn:cli');
  debug('Using local install of dawn');
  require(localCLI);
} else {
  require('../lib/cli');
}
