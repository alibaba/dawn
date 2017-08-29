const path = require('path');
const cli = require('../bin/cli-core');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('cli', function () {

  it('#update', async function () {
    cli.parse(['node', 'dn', 'update']);
    await sleep(4000);
  });

  it('#test1', async function () {
    cli.once('done', function (ctx) {
      expect(ctx.opts.value).to.be.equal('mw1');
    });
    cli.parse(['node', 'dn', 'run', 'test1']);
    await sleep(2000);
  });

  it('#test2', async function () {
    cli.disabledExit = true;
    cli.once('fail', function (err) {
      expect(err.message).to.be.equal('mw2');
    });
    cli.parse(['node', 'dn', 'run', 'test2']);
    await sleep(3000);
  });

  it('#unhandled', async function () {
    cli.parse(['node', 'dn', 'dev']);
    await sleep(2000);
  });

  it('#clean', async function () {
    cli.parse(['node', 'dn', '$', 'clean']);
    await sleep(4000);
  });

});

