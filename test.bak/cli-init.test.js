const path = require('path');
const cli = require('../bin/cli-core');
const fs = require('fs');

describe('cli', function () {

  it('#init', function (done) {
    this.timeout(60000);
    process.chdir(path.resolve(__dirname, './demo2'));
    let confDir = path.resolve(__dirname, './demo2/.dawn/');
    let pipeFile = path.resolve(__dirname, './demo2/.dawn/pipe.yml');
    let rcFile = path.resolve(__dirname, './demo2/.dawn/rc.yml');
    if (fs.existsSync(pipeFile)) fs.unlinkSync(pipeFile);
    if (fs.existsSync(rcFile)) fs.unlinkSync(rcFile);
    if (fs.existsSync(confDir)) fs.rmdirSync(confDir);
    expect(fs.existsSync(pipeFile)).to.be.equal(false);
    cli.once('done', function () {
      expect(fs.existsSync(pipeFile)).to.be.equal(true);
      done();
    });
    cli.parse(['node', 'dn', 'init', '-t', 'unit-demo']);
  });

});

