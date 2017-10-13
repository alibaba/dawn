const webpack = require('webpack');
const generateConfig = require('./generate');
const path = require('path');
const fs = require('fs');
const utils = require('ntils');
const os = require('os');

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

    //复制文件
    let srcTsConfigFile = path.resolve(__dirname, '../tsconfig.json');
    let dstTsCConfigFile = path.resolve(this.cwd, './tsconfig.json');
    if (!fs.existsSync(dstTsCConfigFile)) {
      await this.utils.writeFile(dstTsCConfigFile,
        await this.utils.readFile(srcTsConfigFile));
    }

    this.console.info('开始构建...');

    let config = await generateConfig(this, opts);

    //config
    let customConfigFile = path.resolve(this.cwd, opts.configFile);
    if (fs.existsSync(customConfigFile)) {
      let customConfigsGenerate = require(customConfigFile);
      if (utils.isFunction(customConfigsGenerate)) {
        await customConfigsGenerate(config, webpack, this);
        this.console.info('已合并自定义构建配置');
      } else if (!utils.isNull(customConfigsGenerate)) {
        config = customConfigsGenerate;
        this.console.warn('已使用自定义构建配置');
      }
    }

    //resolve
    config.resolve = config.resolve || {};
    config.resolve.symlinks = true;
    config.resolve.modules = config.resolve.modules || [];
    config.resolve.modules = config.resolve.modules.concat([
      path.resolve(this.cwd, './node_modules/'),
      path.resolve(__dirname, '../node_modules/'),
      this.cwd,
      path.resolve(__dirname, '../')
    ]);
    config.resolveLoader = config.resolve;

    //应用 faked 
    if (this.faked) this.faked.apply(config);
    if (this.emit) this.emit('webpack.config', config);

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

    //build
    let compiler = webpack(config);
    if (opts.watch) {
      compiler.watch(opts.watchOpts, (err, stats) => {
        if (err) return this.console.error(err);
        let json = stats.toJson();
        if (stats.hasErrors()) {
          this.console.error(json.errors.join(os.EOL + os.EOL));
        }
        if (this.emit) this.emit('webpack.stats', stats);
        printStats(json);
        this.console.log('实时编译:', Date.now());
        next();
      });
    } else {
      compiler.run((err, stats) => {
        if (err) return this.console.error('error:', err);
        let json = stats.toJson();
        if (stats.hasErrors()) {
          return this.console.error(json.errors.join(os.EOL + os.EOL));
        }
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
        printStats(json);
        this.console.info('完成');
        next();
      });
    }

  };

};