const path = require('path');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    //在这里处理你的逻辑
    this.console.info('Enable typescript...');

    this.on('webpack.config', webpackConfig => {
      const rules = webpackConfig.module.rules || webpackConfig.module.loaders;
      rules.push({
        test: /\.(ts|tsx)$/,
        loader: 'awesome-typescript-loader'
      });
      webpackConfig.resolve.extensions.unshift('.ts', '.tsx');
    });

    await this.exec({
      name: 'copy',
      files: {
        './tsconfig.json': path.resolve(__dirname, '../files/tsconfig.json')
      },
      override: false
    });

    this.console.info('Done');

    //next 触发后续执行
    //如果需要在后续中间件执行完成再做一些处理
    //还可以 await next(); 并在之后添加逻辑
    next();

  };

};