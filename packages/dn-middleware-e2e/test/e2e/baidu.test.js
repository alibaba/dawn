import assert from 'assert';

describe('demo test', function () {

  beforeEach(async function () {
    await driver.get('https://www.baidu.com');
  });

  it('check title', async function () {
    let title = await driver.getTitle();
    expect(title).to.equal('百度一下，你就知道');
  });

});