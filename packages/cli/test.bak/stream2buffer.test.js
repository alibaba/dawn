const path = require('path');
const fs = require('fs');
const stream2buffer = require('../lib/common/stream2buffer');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('rename', function () {

  it('#rename', async function () {
    let filename = path.normalize(`${__dirname}/demo1/rename.txt`);
    let buffer = await stream2buffer(fs.createReadStream(filename));
    expect(buffer.length > 0).to.be.equal(true);
  });

});