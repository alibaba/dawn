const path = require('path');
const cli = require('../bin/cli-core');
const configs = require('../lib/configs');
const sleep = require('../lib/common/sleep');

process.env.DEBUG = 'cli';
process.chdir(path.resolve(__dirname, '../test/demo2'));

(async () => {
  cli.parse(['node', 'dn', 'config', 'cacheTTL', Date.now()]);
  await sleep(2000);
  console.log(await configs.getRc('cacheTTL'));
})();