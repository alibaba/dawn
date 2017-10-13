import assert from 'assert';

describe('demo test', function () {

  beforeEach(async function () {
    await driver.get('http://localhost:8000/');
  });

  it('check title', async function () {
    let title = await driver.getTitle();
    expect(title).to.equal('Not Found (404)');
  });

});