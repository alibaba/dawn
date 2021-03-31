const path = require('path');
const oneport = require('../lib/common/oneport');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('oneport', function () {

  it('#oneport', async function () {
    let port = await oneport();
    expect(port > 0).to.be.equal(true);
  });

});