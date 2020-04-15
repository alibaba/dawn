const path = require('path');
const configs = require('../lib/configs');
const fetch = require('../lib/common/fetch');
const store = require('../lib/store');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('configs', function () {

  it('#setLocalRc() & #getLocalRc()', async function () {
    await configs.setLocalRc('test', '1');
    let value1 = await configs.getLocalRc('test');
    expect(value1).to.be.equal('1');
    await configs.setLocalRc('test', '2');
    let value2 = await configs.getLocalRc('test');
    expect(value2).to.be.equal('2');
  });

  it('#setLocalConf() & #getLocalConf()', async function () {
    await configs.setLocalConf('test', '1');
    let value1 = await configs.getLocalConf('test');
    expect(value1).to.be.equal('1');
    await configs.setLocalConf('test', '2');
    let value2 = await configs.getLocalConf('test');
    expect(value2).to.be.equal('2');
  });

  it('#getRemoteConf()', async function () {
    // 1
    fetch.filter = null;
    await store.clean();
    let value1 = await configs.getRemoteConf('test', '1');
    expect(value1).to.be.equal('1');
    // 2
    fetch.filter = function (url) {
      if (!url.endsWith('test2.yml')) return;
      return async function () {
        let text = async () => {
          return 'test2';
        };
        return { status: 200, text };
      }
    };
    let value2 = await configs.getRemoteConf('test2', '2');
    expect(value2).to.be.equal('test2');
  });

});