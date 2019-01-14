const webpack = require('webpack');
const path = require('path');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const os = require('os');
const md5 = require('md5');
const fs = require('fs');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts = Object.assign({ output: 'build/js', libName: 'lib' }, opts);

  //构建 lib
  async function buildLib(vendors, cacheDir) {
    const plugins = [new webpack.DllPlugin({
      path: path.normalize(`${cacheDir}/manifest.json`),
      name: opts.libName,
      context: this.cwd,
    }), new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })];
    if (opts.compress !== false) {
      plugins.push(new UglifyJsParallelPlugin({
        workers: opts.maxThread || os.cpus().length,
        cacheDir: path.resolve(cacheDir, `./.uglify/`),
        mangle: false,
        sourceMap: false,
        compressor: { warnings: false }
      }));
    }
    await this.exec({
      name: 'webpack',
      watch: opts.watch,
      _isLib: true,
      configObject: {
        context: this.cwd,
        output: {
          path: cacheDir,
          filename: '[name].js',
          library: opts.libName
        },
        entry: { bundle: vendors },
        plugins: plugins
      }
    });
  }

  return async function (next) {

    //计算 lib 资源
    const vendors = opts.vendors || Object.keys(this.project.dependencies || {});

    //计算项目缓存目录
    const cacheKey = md5(JSON.stringify(vendors));
    const cacheDir = path.normalize(`${this.cwd}/.cache`);

    //lib 生成
    this.console.log('检查 lib 的 hash');
    const hashFile = path.normalize(`${cacheDir}/.hash`);
    const hash = fs.existsSync(hashFile) ?
      (await this.utils.readFile(hashFile)).toString() : '';
    if (vendors && vendors.length > 0 && hash !== cacheKey) {
      this.console.log('开始生成 lib');
      await buildLib.call(this, vendors, cacheDir);
      const output = path.resolve(this.cwd, opts.output);
      await this.exec({
        name: 'copy',
        files: {
          [`${output}/${opts.libName}.js`]: `${cacheDir}/bundle.js`
        }
      });
      this.console.info('记录 lib 的 hash');
      await this.utils.writeFile(hashFile, cacheKey);
      this.console.log('生成 lib 完成');
    } else {
      this.console.log('使用 lib 缓存');
    }
    this.console.info('Done');

    //lib 引用
    this.once('webpack.config', (webpackConf, webpack, webpackOpts) => {
      if (webpackOpts._isLib) return;
      const manifestFile = path.normalize(`${cacheDir}/manifest.json`);
      if (!fs.existsSync(manifestFile)) {
        throw new Error(`Cannt find lib '${opts.libName}'`);
      };
      webpackConf.plugins.push(new webpack.DllReferencePlugin({
        context: this.cwd,
        manifest: require(manifestFile),
      }));
    });

    next();

  };

};