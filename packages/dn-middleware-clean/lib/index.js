/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {
    this.console.info('清理文件或目录...');
    await this.utils.del(opts.target || './build/**/*.*');
    this.console.info('完成');
    next();

  };  

};