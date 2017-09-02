const path = require('path');
const sleep = require('../lib/common/sleep');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('sleep', function () {

  it('#sleep', async function () {
    let time = Date.now();
    await sleep(100);
    expect(Date.now() - time >= 100).to.be.equal(true);
  });

});