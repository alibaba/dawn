const jest = require('jest');
const argv = require('./setup');

/**
 * 这是一个使用 jest 做单元测试的 dawn 中间件
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {
  argv.push(...opts.argv);

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    //在这里处理你的逻辑
    this.console.info('Start run unit tests by Jest...');

    try {
      // await this.utils.exec(`${jest} ${files}`);
      await jest.run(argv);
    } catch (error) {
      this.console.error('Jest test failed, see more: https://facebook.github.io/jest/docs/en/getting-started.htm');
      this.console.error(error.message);
    }

    //next 触发后续执行
    //如果需要在后续中间件执行完成再做一些处理
    //还可以 await next(); 并在之后添加逻辑
    next();
  };
};