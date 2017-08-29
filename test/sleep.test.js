const path = require('path');
const sleep = require('../lib/common/sleep');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('sleep', function () {

  it('#sleep', async function () {
    let time = Date.now();
    await sleep(1000);
    expect(Date.now() - time >= 1000).to.be.equal(true);
  });

});