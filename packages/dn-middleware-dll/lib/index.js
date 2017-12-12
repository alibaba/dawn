const webpack = require('webpack');
const path = require('path');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts = Object.assign({
    output: 'build/js',
    lib: 'lib'
  }, opts);

  //构建 lib
  async function buildLib(vendors) {
    this.console.info('生成 lib ...');
    let output = path.resolve(this.cwd, opts.output);
    await this.exec({
      name: 'webpack',
      watch: opts.watch,
      _isLib: true,
      configObject: {
        context: this.cwd,
        output: {
          path: output,
          filename: '[name].js',
          library: '[name]',
        },
        entry: { [opts.lib]: vendors },
        plugins: [
          new webpack.DllPlugin({
            path: path.normalize(`${output}/${opts.lib}.manifest.json`),
            name: '[name]',
            context: this.cwd,
          }),
        ]
      }
    });
    this.console.info('Done');
  }

  return async function (next) {

    //lib 生成
    let vendors = opts.vendors || Object.keys(this.project.dependencies);
    if (vendors && vendors.length > 0) {
      await buildLib.call(this, vendors);
    }

    //lib 引用
    this.on('webpack.config', (webpackConf, webpack, webpackOpts) => {
      if (webpackOpts._isLib) return;
      let manifestFile = webpackOpts.manifest ||
        './build/js/lib.manifest.json';
      manifestFile = path.resolve(this.cwd, manifestFile);
      webpackConf.plugins.push(new webpack.DllReferencePlugin({
        context: this.cwd,
        manifest: require(manifestFile),
      }));
    });

    next();

  };

};