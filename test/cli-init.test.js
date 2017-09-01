const path = require('path');
const cli = require('../bin/cli-core');
const fs = require('fs');

describe('cli', function () {

  it('#init', async function () {
    this.timeout(20000);
    process.chdir(path.resolve(__dirname, './demo2'));
    let dirname = path.resolve(__dirname, './demo2/.dawn/');
    let filename = path.resolve(__dirname, './demo2/.dawn/pipe.yml');
    if (fs.existsSync(filename)) fs.unlinkSync(filename);
    if (fs.existsSync(dirname)) fs.rmdirSync(dirname);
    expect(fs.existsSync(filename)).to.be.equal(false);
    cli.parse(['node', 'dn', 'init', '-t', 'unit-demo']);
    await sleep(18000);
    expect(fs.existsSync(filename)).to.be.equal(true);
  });

});

