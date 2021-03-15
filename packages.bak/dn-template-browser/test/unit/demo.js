import assert from 'assert';
import print from '../../src';

describe('#print()', function () {
  it('打印指定的消息', function () {
    print('hello');
    assert.equal(document.body.innerHTML, 'say: hello');
  });
});