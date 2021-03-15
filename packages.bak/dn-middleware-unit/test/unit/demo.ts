import * as  assert from 'assert';
import resolve from '../../src';

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
      assert.equal(resolve('/a/b/c', '../d'), '/a/b/d');
    });
  });
});