const path = require('path');
const trim = require('../lib/common/trim');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('trim', function () {

  it('#trim1', function () {
    expect(trim('http://test.com/', '/')).to.be.equal('http://test.com');
  });

  it('#trim2', function () {
    expect(trim('http://test.com', '/')).to.be.equal('http://test.com');
  });

  it('#trim3', function () {
    expect(trim('/test/', '/')).to.be.equal('test');
  });

  it('#trim4', function () {
    expect(trim('', '/')).to.be.equal('');
  });

});