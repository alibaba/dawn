const confman = require('confman');
const path = require('path');
const VModule = require('vmodule-webpack-plugin');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts = opts || {};
  opts.dir = opts.dir || './locales';

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    //在这里处理你的逻辑
    this.console.info('启用 i18n...');
    let localePath = path.resolve(this.cwd, opts.dir);
    this.on('webpack.config', webpackConfig => {
      webpackConfig.plugins.push(confman.webpackPlugin({
        name: '$locales',
        path: localePath
      }), new VModule({
        name: '$i18n',
        file: require.resolve('./i18n')
      }));
    });
    this.console.info('完成');

    //next 触发后续执行
    //如果需要在后续中间件执行完成再做一些处理
    //还可以 await next(); 并在之后添加逻辑
    next();

  };

};