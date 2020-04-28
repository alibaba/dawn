const WebpackDevServer = require('webpack-dev-server');
const webpackDevServerConfig = require('./setup');
const registerProxy = require('./proxy');
const express = require('express');
const path = require('path');
const url = require('url');
const fs = require('fs');
var MemoryFileSystem = require("memory-fs");
var fs_memory = new MemoryFileSystem(); // Optionally pass a javascript object

const serverListen = (server, port, host) => new Promise(resolve => server.listen(port, host, resolve))
  .then(e => { if (e) throw new Error(e); });

/**
 * WebpackDevServer Dawn MiddleWare
 * @param {Object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @param {Number} [opts.port=8080] - 端口
 * @param {String} [opts.host='0.0.0.0'] - host
 * @param {String} opts.homepage - 项目线上部署的地址, 访问的 URL
 * @param {Boolean} [opts.addCors=false] - cors header
 * @param {Boolean} [opts.autoOpen=true] - 自动打开
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {
  let {
    protocol = 'http',
    host = '0.0.0.0',
    port = 8080,
    homepage = '',
    addCors = false,
    autoOpen = true,
    logLevel,
    quiet = true,
    overlay = false
  } = opts;
  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {
    
    // 生成正确的 cdn 地址
    // TODO: 这部分与 ali 前端项目开发流耦合严重, 应考虑拆出去
    const { console, utils, cwd } = this;
    
    const proxyFilePath = path.resolve(cwd, './server.yml');
    let rules = [];
    
    if (fs.existsSync(proxyFilePath)) {
      const proxyObj = utils.yaml.parse(fs.readFileSync(proxyFilePath, 'utf8'));
      if (proxyObj.proxy && proxyObj.proxy.rules) {
        rules = proxyObj.proxy.rules;
      }
    }
    
    // add your dev api proxy
    const apiProxy = Object.entries(rules).map(([key, target]) => ({
      context: (pathname) => {
        const condition = new RegExp(key).test(pathname);
        // console.log('---local', condition, pathname, target);
        return condition;
      },
      target,
      changeOrigin: true,
      secure: false
    }));
    
    this.on('webpack.compiler', async (compiler, webpack, opts) => {
      this.webpackRunBySelf = false;
      // Push plugins for HMR
      // webpackConfig.plugins.push(
      //   new webpack.NamedModulesPlugin(),
      //   new webpack.HotModuleReplacementPlugin()
      // );
      const { publicPath } = opts.output;
      
      const proxy = registerProxy(apiProxy, { homepage, protocol, port, publicPath });
      
      const webpackDevServerOptions = webpackDevServerConfig.call(this, {
        proxy, https: protocol.toUpperCase() === 'HTTPS', publicPath, host, logLevel, quiet, overlay, open: autoOpen
      });
      
      var staticFilter = (req, res, next) => {
        try {
          const outputSystem = compiler.outputFileSystem;
          const staticUrl = path.join(this.cwd, `${publicPath ? publicPath : '/build'}`, req.originalUrl);
          const isDir = outputSystem.statSync(staticUrl).isDirectory();
          if (isDir) {
            const requestPath = url.parse(req.originalUrl).pathname;
            const files = outputSystem.readdirSync(staticUrl);
            const filesFinal = files.filter(file => file.indexOf('hot-update') === -1).map(file => {
              let filesTrans = {};
              filesTrans.file = file;
              let itemLink = filesTrans.itemLink = path.join(requestPath, file);
              const stat = outputSystem.statSync(path.join(staticUrl, file));
              if (stat && stat.isDirectory()) {
                filesTrans.itemLink = path.join(itemLink, '/');
                filesTrans.isDir = true;
              }
              return filesTrans
            });
            return res.render('index', { title: 'webpack4-dev-middleware静态资源服务', files: filesFinal });
          } else {
            next();
          }
        } catch (e) {
          next();
        }
      }
      
      webpackDevServerOptions.before = (app) => {
        app.use('/public', express.static(path.join(__dirname, '../public')));
      }
      
      webpackDevServerOptions.after = (app) => {
        app.set('views', path.join(__dirname, '../views'));
        app.set('view engine', 'ejs');
        app.use('/public', express.static(path.join(__dirname, '../public')));
        app.use(staticFilter);
      }
      
      this.once('webpack.stats', async () => {
        try {
          // Launch WebpackDevServer
          await serverListen(server, port, host);
          /*if (autoOpen) {
            utils.open(homepage || `${protocol}://${host}:${port}`);
          }*/
        } catch (error) {
          throw error;
        }
      })
      compiler.hooks.done.tap('afterDone', () => {
        if (this.emit) this.emit('webpack.stats');
        // console.log(JSON.stringify(compiler.outputFileSystem.readdirSync(path.join(this.cwd, '/build'))));
      })
      const server = new WebpackDevServer(compiler, webpackDevServerOptions);
      
      
      this.emit('server.start', server);
      console.info('正在启动开发服务....');
    });
    next();
  };
};