const path = require('path');
const cli = require('../bin/cli-core');
const configs = require('../lib/configs');

describe('cli', function () {

  it('#config', function (done) {
    let ttl1 = Date.now();
    cli.once('done', () => {
      configs.getRc('cache').then(ttl2 => {
        expect(ttl2).to.be.equal(ttl1);
        configs.setLocalRc('cache', 0);
        done();
      });
    });
    cli.parse(['node', 'dn', 'config', 'cache', ttl1]);
  });

});

