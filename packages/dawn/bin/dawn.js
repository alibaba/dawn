#!/usr/bin/env node

const pkg = require('../package.json');

require('please-upgrade-node')(pkg);
require('please-upgrade-npm')(pkg);

if (process.env.DN_DEBUG) {
  process.env.DEBUG = process.env.DN_DEBUG === 'true' ? 'dn:*' : process.env.DN_DEBUG;
}

require('../lib/cli');
