const confman = require('confman');
const path = require('path');
const { VModulePlugin } = require('vmodule-webpack-plugin');
const utils = require('ntils');
const fs = require('fs');
const mkdirp = require('mkdirp');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  //初始化参数
  opts = Object.assign({
    key: '__locale',
    //语言包源文件存放目录
    dir: './locales',
    //小包导出的目标目录
    extract: null,
    //i18n 初始化文件
    init: null
  }, opts);

  return async function (next) {

    const localesPath = path.normalize(path.resolve(this.cwd, opts.dir) + '/');

    const extractBuild = () => {
      const extractPath = path.resolve(this.cwd, opts.extract);
      mkdirp.sync(extractPath);
      const locales = confman.load(localesPath);
      utils.each(locales, (name, locale) => {
        locale.__name__ = name;
        const localeFile = path.normalize(`${extractPath}/${name}.js`);
        const localeCode = `(typeof window !== "undefined" ? window : globalThis)['${opts.key}']=${JSON.stringify(locale)};`;
        fs.writeFileSync(localeFile, localeCode);
      });
      return { _t: Date.now() };
    };

    const addLocales = (conf) => {
      conf.plugins.push(confman.webpackPlugin({
        name: '$locales',
        path: localesPath,
        content: opts.extract ? extractBuild : null
      }));
    };

    const addI18N = (conf) => {
      conf.plugins.push(new VModulePlugin({
        name: '$i18n',
        file: require.resolve('./i18n')
      }));
    };

    const addOpts = (conf) => {
      const key = opts.key;
      const jsx = opts.jsx || opts.react;
      conf.plugins.push(new VModulePlugin({
        name: '$i18n_opts',
        content: { key, jsx }
      }));
    };

    const applyToWebpack = () => {
      this.on('webpack.config', conf => {
        addOpts(conf);
        addLocales(conf);
        addI18N(conf);
      });
    };

    const copyDefaultFiles = async () => {
      if (fs.existsSync(localesPath)) return;
      const templateFiles = path.resolve(__dirname, '../template/**/*.*');
      await this.exec({
        name: 'copy',
        files: {
          [localesPath]: templateFiles
        }
      });
    };

    this.console.info('启用 i18n...');
    await copyDefaultFiles();
    await applyToWebpack();
    this.console.info('完成');

    next();

  };

};