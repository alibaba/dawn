/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts = Object.assign({}, opts);

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    if (!opts.pipe && !opts.when) return next();

    if (!this.utils.isArray(opts.pipe)) {
      opts.pipe = [opts.pipe];
    }

    let call = async pipes => {
      for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        let list = await this.loadPipeline(pipe);
        if (!list || list.length < 1) continue;
        this.console.info(`Calling '${pipe}'`);
        await this.exec(list);
      }
    };

    let compileCache = {};
    let compile = function (expr) {
      if (!compileCache[expr]) {
        compileCache[expr] = new Function(`return (${expr})`);
      }
      return compileCache[expr];
    };

    let list = [...opts.pipe];

    this.utils.each(opts.when, (expr, pipe) => {
      let func = compile(expr);
      if (func.call(this)) list.push(pipe);
    });

    await call(list);

    //next 触发后续执行
    //如果需要在后续中间件执行完成再做一些处理
    //还可以 await next(); 并在之后添加逻辑
    next();

  };

};