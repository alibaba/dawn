const path = require('path');
const fs = require('fs');
const rename = require('../lib/common/rename');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('rename', function () {

  it('#rename', async function () {
    let filename1 = path.normalize(`${__dirname}/demo1/rename.txt`);
    let filename2 = path.normalize(`${__dirname}/demo1/rename2.txt`);
    expect(fs.existsSync(filename1)).to.be.equal(true);
    expect(fs.existsSync(filename2)).to.be.equal(false);
    await rename(filename1, filename2);
    expect(fs.existsSync(filename1)).to.be.equal(false);
    expect(fs.existsSync(filename2)).to.be.equal(true);
    await rename(filename2, filename1);
    expect(fs.existsSync(filename1)).to.be.equal(true);
    expect(fs.existsSync(filename2)).to.be.equal(false);
  });

});