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
  async function buildLib(vendors, projectCacheDir) {
    let libCacheDir = path.normalize(`${projectCacheDir}/${opts.libName}`);
    if (opts.cache !== false && fs.existsSync(libCacheDir)) return libCacheDir;
    let plugins = [new webpack.DllPlugin({
      path: path.normalize(`${libCacheDir}/manifest.json`),
      name: opts.libName,
      context: this.cwd,
    })];
    if (opts.compress !== false) {
      plugins.push(new UglifyJsParallelPlugin({
        workers: opts.maxThread || os.cpus().length,
        cacheDir: path.resolve(libCacheDir, `./.cache/`),
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
          path: libCacheDir,
          filename: '[name].js',
          library: opts.libName
        },
        entry: { bundle: vendors },
        plugins: plugins
      }
    });
    return libCacheDir;
  }

  return async function (next) {

    //计算 lib 资源
    let vendors = opts.vendors || Object.keys(this.project.dependencies || {});

    //计算项目缓存目录
    let cacheKey = md5(JSON.stringify(this.project.dependencies) +
      JSON.stringify(this.project.devDependencies) + JSON.stringify(vendors));
    let projectCacheDir = path.normalize(
      `${process.env.TMPDIR}/${this.project.name}/${cacheKey}`
    );

    //lib 生成
    this.console.info('生成 lib ...');
    if (vendors && vendors.length > 0) {
      let libCacheDir = await buildLib.call(this, vendors, projectCacheDir);
      let output = path.resolve(this.cwd, opts.output);
      await this.exec({
        name: 'copy',
        files: {
          [`${output}/${opts.libName}.js`]: `${libCacheDir}/bundle.js`
        }
      });
    }
    this.console.info('Done');

    //lib 引用
    this.once('webpack.config', (webpackConf, webpack, webpackOpts) => {
      if (webpackOpts._isLib) return;
      let manifestFile = path.normalize(
        `${projectCacheDir}/${opts.libName}/manifest.json`
      );
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