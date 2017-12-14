module.exports = function () {
  return async function (next) {
    //支持编译
    this.on('webpack.config', (webpackConf) => {
      this.console.info('启用 JSX Control Statements...');
      let babelLoader = webpackConf.module.loaders
        .find(item => item.loader == 'babel-loader');
      if (babelLoader.options) {
        babelLoader.options.plugins = babelLoader.plugins || [];
        babelLoader.options.plugins.push('jsx-control-statements');
      }
    });
    //支持 lint
    this.on('lint.rules', (rules) => {
      this.console.info('启用 JSX Control Statements 语法检查...');
      rules.plugins = rules.plugins || [];
      rules.plugins.push('jsx-control-statements');
      rules.extends = rules.extends || [];
      rules.extends.push('plugin:jsx-control-statements/recommended');
    });
    next();
  };
};