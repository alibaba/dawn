const confman = require('confman');
const path = require('path');
const VModule = require('vmodule-webpack-plugin');
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
    dir: './locales',
    extract: null,
    init: null
  }, opts);

  return async function (next) {

    const localesPath = path.normalize(path.resolve(this.cwd, opts.dir) + '/');

    const addLocales = (conf) => {
      if (opts.extract) return conf.plugins.push(new VModule({
        name: '$locales', content: '{}'
      }));
      conf.plugins.push(confman.webpackPlugin({
        name: '$locales',
        path: localesPath
      }));
    };

    const addI18N = (conf) => {
      conf.plugins.push(new VModule({
        name: '$i18n',
        file: require.resolve('./i18n')
      }));
    };

    const applyToWebpack = () => {
      this.on('webpack.config', conf => {
        addLocales(conf);
        addI18N(conf);
      });
    };

    const extractBuild = () => {
      if (!opts.extract) return;
      const extractPath = path.resolve(this.cwd, opts.extract);
      mkdirp.sync(extractPath);
      const locales = confman.load(localesPath);
      utils.each(locales, (name, locale) => {
        const localeFile = path.normalize(`${extractPath}/${name}.js`);
        const localeCode = `window.__locale=${JSON.stringify(locale)};`;
        fs.writeFileSync(localeFile, localeCode);
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
    await extractBuild();
    this.console.info('完成');

    next();

  };

};