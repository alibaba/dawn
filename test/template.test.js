const path = require('path');
const template = require('../lib/template');
const utils = require('../lib/common/utils');
const mkdirp = require('../lib/common/mkdirp');
const fs = require('fs');

beforeEach(function () {
  process.chdir(path.resolve(__dirname, './demo1'));
});

describe('template', function () {

  it('#search', async function () {
    let result1 = await template.search();
    expect(utils.isArray(result1)).to.be.equal(true);
    expect(result1.length > 0).to.be.equal(true);
    let result2 = await template.search('----');
    expect(utils.isArray(result2)).to.be.equal(true);
    expect(result2.length < 1).to.be.equal(true);
  });

  it('#extract', async function () {
    let tmpDir = process.env.TMP || process.env.TMPDIR;
    let target = `${tmpDir}/${utils.newGuid()}`;
    await mkdirp(target);
    await template.extract('dn-template-unit-demo', target);
    let isDone = fs.existsSync(`${target}/package.json`);
    expect(isDone).to.be.equal(true);
  });

});