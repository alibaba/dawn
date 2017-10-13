/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
const webpack = require('webpack');
const webpackConfigsFactory = require('./webpack.configs');
const path = require('path');
const fs = require('fs');
const async = require('async');

var connect = require('connect');
var favicon = require('serve-favicon');
var _static = require('serve-static');
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");


module.exports = function (opts) {

  opts.config = opts.config || './webpack.configs.js';
  opts.static = opts.static || './';
  opts.watchOpts = opts.watchOpts || {};

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {
    let SERVER_DEPORT = opts.port || (await this.utils.oneport());
    //在这里处理你的逻辑
    this.console.info('开始构建...');
    // path
    let server_path = path.resolve(this.cwd, './src');
    let static_path = path.resolve(this.cwd, opts.static);
    let obj = {
      middlewareDir: path.resolve(__dirname, '../'),
      currentRepoDir: this.cwd
    }
    let webpackConfigs = webpackConfigsFactory(Object.assign({}, obj, opts));

    //config
    let custonConfigFile = path.resolve(this.cwd, opts.config);
    if (fs.existsSync(custonConfigFile)) {
      let customConfigsFactory = require(custonConfigFile);
      if (typeof customConfigsFactory == 'function') {
        await customConfigsFactory(webpackConfigs);
      }
    }

    var publicPath = 'http://localhost:' + SERVER_DEPORT;
    var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
    /***deg 環境下，增加hotload***/
    function addHotMiddlewareScriptToWebpackConfigs() {
      var entry = webpackConfigs.entry;
      var newEntry = {};
      for (var key in entry) {
        newEntry[key] = [entry[key], hotMiddlewareScript]
      }
      webpackConfigs.entry = newEntry;
    }



    var server = connect();
    //注入到上下文中
    this.webpack1Server = server;

    var env = process.env.NODE_ENV;

    if (opts.debug) {
      addHotMiddlewareScriptToWebpackConfigs();
      //应用 faked
      if (this.faked) this.faked.apply(webpackConfigs);
      var compiler = webpack(webpackConfigs);
      // handle favicon.ico
      server.use('/favicon.ico', function (req, res) {
        res.end('');
      });
      server.use(webpackDevMiddleware(compiler, {
        contentBase: webpackConfigs.output.path,
        publicPath: webpackConfigs.output.publicPath,
        hot: true,
        // stats: webpackDevConf.devServer.stats
        stats: {
          cached: false,
          colors: true
        },
        historyApiFallback: true
      }));
      server.use(webpackHotMiddleware(compiler));
      //以上为静态资源目录，除了以上路径，其他都默认为mock数据
      server.use(_static(server_path, {
        maxage: 0
      }));
      server.use(_static(static_path, {
        maxage: 0
      }));
      server.listen(SERVER_DEPORT, function () {
        this.console.info('webpack1 server is running at :' + SERVER_DEPORT + ' ,please visit:  http://localhost:' + SERVER_DEPORT);
        this.utils.open('http://localhost:' + SERVER_DEPORT);
      }.bind(this));
      next();
    } else {
      //console.log('builder',JSON.stringify(webpackConfigs));
      //build
      let compiler = webpack(webpackConfigs);
      compiler.run((err, stats) => {
        if (err) {
          console.error(err.stack || err);
          if (err.details) {
            this.console.error(err.details);
          }
          return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
          return this.console.error(info.errors);
        }
        this.console.info('完成');
        next();
      });

      // webpack(webpackConfigs, function (err, stats) {
      //   if (err) console.log(err);
      //   // gutil.log('[webpack]', stats.toString({
      //   //   colors: true
      //   // }));
      //   // console.log( new Error(stats.toString({
      //   //   errorDetails: false
      //   //   //warnings: true
      //   // }))  );
      //   //console.log('Generate entry htmlPage');
      //   //build(cmd);

      //   console.log('All assets has compiled!');
      //   process.exit();
      // });


    }








  };

};