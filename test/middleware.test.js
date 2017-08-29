const path = require('path');
const middleware = require('../lib/middleware');
const utils = require('../lib/common/utils');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('middleware', function () {

  it('#search', async function () {
    let result1 = await middleware.search();
    expect(utils.isArray(result1)).to.be.equal(true);
    expect(result1.length > 0).to.be.equal(true);
    let result2 = await middleware.search('----');
    expect(utils.isArray(result2)).to.be.equal(true);
    expect(result2.length < 1).to.be.equal(true);
  });

});