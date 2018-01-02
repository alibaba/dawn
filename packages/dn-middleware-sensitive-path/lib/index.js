const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

module.exports = function (opts) {

  return async function (next) {

    this.once('webpack.config', (webpackConf) => {
      this.console.info('已强制区分模块路径大小写...');
      webpackConf.plugins.push(new CaseSensitivePathsPlugin());
    });
    next();

  };

};