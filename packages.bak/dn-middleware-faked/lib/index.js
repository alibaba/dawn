const globby = require('globby');
const utils = require('ntils');
const path = require('path');
const fs = require('fs');
const fakedPlugin = require('faked/plugins/webpack');
const m2faked = require('./m2faked');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的接口)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    //处理参数
    opts.dir = opts.dir || 'mock';
    opts.port = opts.port || await this.utils.oneport();
    opts.console = this.console;
    opts.done = async (server) => {
      if (opts.m2f) await m2faked({ dir: opts.dir });
      if (opts.autoOpen != false) this.utils.open(server.url);
    };

    //创建 faked 对象
    this.faked = Object.create(null);

    //创建应用函数
    this.faked.apply = webpackConfig => {
      if (this.__applyed) return;
      this.__applyed = true;
      webpackConfig.entry = fakedPlugin.entry(webpackConfig.entry, opts);
    };
    next();

  };

};