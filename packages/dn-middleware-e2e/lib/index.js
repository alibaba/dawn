const path = require('path');
const fs = require('fs');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts.files = opts.files || './test/e2e/**/*.js';
  opts.timeout = opts.timeout || 5000;
  opts.browser = opts.browser || 'none';

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    let mocha = path.resolve(__dirname, '../node_modules/.bin/mocha');
    let setup = path.resolve(__dirname, './setup.js');

    this.console.info('开始执行 E2E 测试...');
    //tnpm i babel-runtime
    /* eslint-disable */
    await this.utils.exec(`
     WEB_DRIVER_BROWSER=${opts.browser} ${mocha} -r ${setup} -t ${opts.timeout} -u bdd ${opts.files} 
    `);
    /* eslint-enable */
    this.console.info('完成');

    next();

  };

};