const nokit = require('nokitjs');
const ExpressPlugin = require('nokit-plugin-express');
const ProxyFilter = require('nokit-filter-proxy');
const fs = require('fs');
const path = require('path');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts.host = opts.host || 'http://localhost';
  opts.config = opts.config || 'server';

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    opts.public = opts.public || './build';
    if (this.utils.oneport) {
      opts.port = opts.port || await this.utils.oneport();
    } else {
      opts.port = opts.port || 8001;
    }

    //处理默认文件
    let srcFile = path.resolve(__dirname, '../server.yml');
    let dstFile = path.resolve(this.cwd, './server.yml');
    if (!fs.existsSync(dstFile)) {
      let buffer = await this.utils.readFile(srcFile);
      await this.utils.writeFile(dstFile, buffer);
    }

    //在这里处理你的逻辑
    this.console.log('启动开发服务器...');

    /**
     * 创建 server 实例
     **/
    let server = new nokit.Server({
      root: this.cwd,
      port: opts.port,
      config: opts.config,
      cache: {
        enabled: false,
        maxAge: 0
      },
      public: {
        '*': opts.public
      }
    });

    //注册代理 filter
    let proxyFilter = new ProxyFilter(server);
    server.filter('^/@server', proxyFilter);

    //添加 express 支持插件
    server.plugin('express', new ExpressPlugin());

    this.server = server;
    this.httpServer = server.httpServer;


    /**
     * 启动 server
     **/
    server.start(async (err, msg) => {
      if (err) {
        this.console.error(err);
      } else {
        this.console.info(msg);
        await this.utils.sleep(1000);
        if (opts.autoOpen !== false) {
          this.utils.open(`${opts.host}:${opts.port}`);
        }
        next();
      }
    });

  };

};