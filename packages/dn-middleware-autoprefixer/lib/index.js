/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function() {
  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function(next) {
    this.on('webpack.config', webpackConfig => {
      const rules = webpackConfig.module.rules || webpackConfig.module.loaders;

      ['.less', '.css'].forEach(suffix => {
        const rule = rules.find(item => suffix.match(item.test));
        const postcssLoader = rule.loader.find(item => item.loader === 'postcss-loader');
        if (postcssLoader) return;

        const cssLoaderIndex = rule.loader.findIndex(item => item.loader === 'css-loader');
        rule.loader.splice(cssLoaderIndex + 1, 0, {
          loader: 'postcss-loader',
          options: {
            plugins: () => [
              require('autoprefixer')({
                browsers: ['last 2 versions', 'IE >= 9']
              })
            ]
          }
        });
      });
    });

    //next 触发后续执行
    //如果需要在后续中间件执行完成再做一些处理
    //还可以 await next(); 并在之后添加逻辑
    next();
  };
};
