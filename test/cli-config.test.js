const path = require('path');
const cli = require('../bin/cli-core');
const configs = require('../lib/configs');

describe('cli', function () {

  it('#config', async function () {
    let ttl1 = Date.now();
    cli.parse(['node', 'dn', 'config', 'cacheTTL', ttl1]);
    await sleep(2000);
    let ttl2 = await configs.getRc('cacheTTL');
    expect(ttl2).to.be.equal(ttl1);
    configs.setLocalRc('cacheTTL', 0);
  });

});

