/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const path = require('path');
const cli = require('../bin/cli-core');
const configs = require('../lib/configs');
const sleep = require('../lib/common/sleep');

process.env.DEBUG = 'cli';
//process.chdir(path.resolve(__dirname, '../test/demo1'));

(async () => {
  process.chdir(path.resolve(__dirname, '../test/demo2'));
  cli.once('done', () => {
    console.log('done');
  });
  cli.parse(['node', 'dn', 'update']);
})();