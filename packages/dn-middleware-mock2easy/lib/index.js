/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */

var mock2easyMiddleware = require('mock2easy-middleware');
var _ = require('lodash');


module.exports = function (opts) {

  opts.server = opts.server || 'webpack1Server';
  opts.port = opts.port || 8005;
  opts.lazyLoadTime = opts.lazyLoadTime || 3000;
  opts.database = opts.database || 'mock2easy';
  opts.doc = opts.doc || 'doc';
  opts.interfaceSuffix = opts.interfaceSuffix || '.json';
  opts.preferredLanguage = opts.preferredLanguage || 'en';

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    this[opts.server].use(mock2easyMiddleware(_.assignIn({
      port: opts.port,
      lazyLoadTime: opts.lazyLoadTime,
      database: opts.database,
      doc: opts.doc,
      ignoreField: [],
      interfaceSuffix: opts.interfaceSuffix,
      preferredLanguage: opts.preferredLanguage,
      interfaceRule: opts.interfaceRule
    }, opts.config)));
    this.webpack1Server.use(require(`${this.cwd}/${opts.database}/do`))

    next();

  };

};