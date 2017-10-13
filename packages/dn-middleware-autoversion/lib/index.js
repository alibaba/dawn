const path = require('path');

/** 
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {


  function generate() {
    let now = new Date();
    let year = Number(now.getFullYear().toString().substr(2));
    return year * 1000000 + now.getMonth() * 100000 +
      now.getDate() * 10000 + now.getDay() * 1000 +
      now.getHours() * 100 + now.getMinutes() * 10 +
      now.getSeconds()
  }

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    //在这里处理你的逻辑
    this.console.info('Auto generate version...');
    let pkgFile = path.normalize(`${this.cwd}/package.json`);
    let pkg = require(pkgFile);
    let versionInfo = pkg.version.split('.');
    versionInfo.length--;
    versionInfo.push(generate());
    pkg.version = versionInfo.join('.');
    await this.utils.writeFile(pkgFile, JSON.stringify(pkg, null, '  '));
    this.console.info('Done');

    //next 触发后续执行
    //如果需要在后续中间件执行完成再做一些处理
    //还可以 await next(); 并在之后添加逻辑
    next();

  };

};