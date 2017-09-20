#!/usr/bin/env node

/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const console = require('console3');
const pkg = require('../package.json');
const semver = require('semver');
const debug = require('debug')('cli');

debug('process.version', process.version);
debug('pkg.engines.node', pkg.engines.node);
if (!semver.satisfies(process.version, pkg.engines.node)) {
  return console.error([`The Node version requirement is ${pkg.engines.node}`,
  `but the current version is ${process.version}`].join(', '));
}

debug('process.argv', process.argv);
require('./cli-core').ready();