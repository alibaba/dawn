const path = require('path');
const mod = require('../lib/mod');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('mod', function () {

  it('#download', async function () {
    this.timeout(60000);
    let filename = await mod.download('dn-template-unit-demo');
    expect(!!filename).to.be.equal(true);
  });

});