/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const path = require('path');
const cli = require('../bin/cli-core');
const configs = require('../lib/configs');
const sleep = require('../lib/common/sleep');

process.env.DEBUG = 'cli';
process.chdir(path.resolve(__dirname, '../test/demo1'));

(async () => {
  cli.once('done', function (ctx) {
    console.log(ctx.opts.value);
  });
  cli.parse(['node', 'dn', 'run', 'test1']);
  await sleep(3000);
})();