const assert = require('assert');
const resolve = require('../../src');

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});

describe('Demo', function () {
  describe('#resolve()', function () {
    it('resolve', function () {
      expect(resolve('/a/b/c', '../d')).to.be.equal('/a/b/d');
    });
  });
});