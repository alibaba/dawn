const FakedPlugin = require("faked/plugins/webpack");

module.exports = function (opts) {
  return async function (next) {
    this.console.info('faked enable ...');
    this.on('webpack.config', webpackConfig => {
      webpackConf.plugins = webpackConf.plugins || [];
      webpackConf.plugins.push(new FakedPlugin(opts));
    });
    next();
  };
};