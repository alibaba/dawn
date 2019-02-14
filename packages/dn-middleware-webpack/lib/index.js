const webpack = require('webpack');
const generateConfig = require('./generate');
const path = require('path');
const fs = require('fs');
const utils = require('ntils');
const os = require('os');
const formatMessages = require('./formatMessages');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts.configFile = opts.configFile || './webpack.config.js';
  opts.watchOpts = opts.watchOpts || {};
  opts.watchOpts.aggregateTimeout = opts.watchOpts.aggregateTimeout || 600;
  opts.watchOpts.ignored = opts.watchOpts.ignored || /node_modules/;
  opts.inject = opts.inject || [];
  opts.babel = opts.babel || {};

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    this.webpack = webpack;

    this.console.info('开始构建...');
    if (this.emit) this.emit('webpack.opts', opts, webpack);
    let config = opts.configObject || await generateConfig(this, opts);

    //config
    let customConfigFile = path.resolve(this.cwd, opts.configFile);
    if (fs.existsSync(customConfigFile)) {
      let customConfigsGenerate = require(customConfigFile);
      if (utils.isFunction(customConfigsGenerate)) {
        await customConfigsGenerate(config, webpack, this);
        this.console.info('已合并自定义构建配置...');
      } else if (!utils.isNull(customConfigsGenerate)) {
        config = customConfigsGenerate;
        this.console.warn('已使用自定义构建配置...');
      }
    }

    //resolve
    config.resolve = config.resolve || {};
    config.resolve.symlinks = true;
    config.resolve.modules = config.resolve.modules || [];
    config.resolve.modules = config.resolve.modules.concat([
      'node_modules',
      path.resolve(this.cwd, './node_modules/'),
      path.resolve(__dirname, '../node_modules/'),
      this.cwd,
      path.resolve(__dirname, '../')
    ]);
    config.resolveLoader = config.resolve;

    //应用 faked 
    if (this.faked) this.faked.apply(config);
    if (this.emit) this.emit('webpack.config', config, webpack, opts);
    this.webpackConfig = config;

    await this.utils.sleep(1000);

    function printStats(json) {
      if (!opts.optimization || !opts.optimization.bailout) return;
      json.modules.forEach(item => {
        if (!item.optimizationBailout ||
          item.optimizationBailout.length < 1) {
          return;
        }
        this.console.log(item.name);
        item.optimizationBailout.
          forEach(msg => this.console.warn(`  ${msg}`));
      });
    }

    function printErrors(json) {
      let messages = formatMessages(json);

      // If errors exist, only show errors.
      if (messages.errors.length) {
        // Only keep the first error. Others are often indicative
        // of the same problem, but confuse the reader with noise.
        if (messages.errors.length > 1) {
          messages.errors.length = 1;
        }
        this.console.error('Failed to compile.' + os.EOL);
        this.console.error(messages.errors.join(os.EOL + os.EOL));
        this.console.log('');

        // Show warnings if no errors were found.
      } else if (messages.warnings.length) {
        this.console.warn('Compiled with warnings.' + os.EOL);
        this.console.warn(messages.warnings.join(os.EOL + os.EOL));
        this.console.log('');
      }
    }

    //build
    let compiler = webpack(config);

    // register 'webpack.compiler' event.
    // support webpackDevServer (or other) middleware(s)
    // to use webpack compiler instance
    if (this.emit) this.emit('webpack.compiler', compiler, webpack, opts);

    if (opts.watch) {
      if (this.emit) this.emit('webpack.watch', compiler, webpack, opts);
      compiler.watch(opts.watchOpts, (err, stats) => {
        if (err) return this.console.error(err);
        let json = stats.toJson({}, true);
        printErrors.call(this, json);
        if (this.emit) this.emit('webpack.stats', stats);
        printStats.call(this, json);
        this.console.log('实时编译:', Date.now());
        next();
      });
    } else {
      if (this.emit) this.emit('webpack.run', compiler, webpack, opts);
      compiler.run((err, stats) => {
        if (err) return this.console.error('error:', err);
        let json = stats.toJson({}, true);
        printErrors.call(this, json);
        if (this.emit) this.emit('webpack.stats', stats);
        this.console.log('');
        utils.each(json.assetsByChunkName, (chunkName, assets) => {
          this.console.info(`Chunk: ${chunkName}`);
          if (utils.isArray(assets)) {
            this.console.log(
              assets.map(name => ` file: ${name}`).join(os.EOL)
            );
          }
          this.console.log('');
        });
        printStats.call(this, json);
        this.console.info('完成');
        next();
      });
    }

  };

};
