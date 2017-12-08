const os = require('os');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const HappyPack = require('happypack');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts = Object.assign({}, opts);

  const happyThreadPool = HappyPack.ThreadPool({
    size: opts.maxThread || os.cpus().length
  });

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    //在这里处理你的逻辑
    this.on('webpack.config', conf => {
      //查找 uglify 插件
      let UglifyJsPlugin = this.webpack.optimize.UglifyJsPlugin;
      let uglifyIndex = conf.plugins
        .findIndex(item => item instanceof UglifyJsPlugin);
      //替换 uglify 
      conf.plugins[uglifyIndex] = new UglifyJsParallelPlugin({
        workers: opts.maxThread,
        cacheDir: '.cache/',
        mangle: false,
        sourceMap: false,
        compressor: { warnings: false }
      });
      //获取原始 babel loader 配置
      let babelLoaderIndex = conf.module.loaders
        .findIndex(item => item.loader == 'babel-loader');
      let babelLoader = conf.module.loaders[babelLoaderIndex];
      //创建 babel 加速配置
      conf.plugins.push(new HappyPack({
        id: 'babel',
        threadPool: happyThreadPool,
        loaders: [{
          loader: 'babel-loader',
          options: babelLoader.options
        }]
      }));
      babelLoader.loader = 'happypack/loader?id=babel';
      delete babelLoader.options;
      //显示加速成功信息
      this.console.info('Webpack is speeding up');
    });

    //next 触发后续执行
    //如果需要在后续中间件执行完成再做一些处理
    //还可以 await next(); 并在之后添加逻辑
    next();

  };

};