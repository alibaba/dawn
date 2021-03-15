const pkg = require('../package');
const log = require('./common/log');
const config = require('$config');

const styles1 = require('./assets/index.less');
const styles2 = require('./assets/test1.css');

const testejs = require('./test.ejs');

log('这是 test1');
const x = { pkg };

function render() {
  return <div>
    {do {
      if(x){
        <span>A</span>
      } else {
        <span>B</span>
      }
    }}
  </div>
}