const path = require('path');
const cli = require('../bin/cli-core');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('cli', function () {

  it('#update', function (done) {
    cli.once('done', () => {
      done();
    });
    cli.parse(['node', 'dn', 'update']);
  });

  it('#test1', function (done) {
    this.timeout(20000);
    process.chdir(path.resolve(__dirname, './demo1'));
    cli.once('done', function (ctx) {
      expect(ctx.opts && ctx.opts.value).to.be.equal('mw1');
      done();
    });
    cli.parse(['node', 'dn', 'run', 'test1']);
  });

  it('#test2', function (done) {
    cli.disabledExit = true;
    cli.once('fail', function (err) {
      expect(err.message).to.be.equal('mw2');
      done();
    });
    cli.parse(['node', 'dn', 'run', 'test2']);
  });

  it('#unhandled', function (done) {
    cli.once('done', () => {
      done();
    });
    cli.parse(['node', 'dn', 'dev']);
  });

  it('#clean', function (done) {
    cli.once('done', () => {
      done();
    });
    cli.parse(['node', 'dn', '$', 'clean']);
  });

});

