/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts = opts || {};

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    if (!opts.template) return next();

    if (!this.utils.isArray(opts.template)) {
      opts.template = [opts.template];
    }

    //在这里处理你的逻辑
    this.console.info('Load reference...');
    for (let template of opts.template) {
      await this.templateMgr.init(template, this.cwd);
    }
    let templateName = this.cli.get('template');
    await this.templateMgr.init(templateName, this.cwd);
    this.console.info('Done');

    //next 触发后续执行
    //如果需要在后续中间件执行完成再做一些处理
    //还可以 await next(); 并在之后添加逻辑
    next();

  };

};