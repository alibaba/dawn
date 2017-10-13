const path = require('path');
const utils = require('ntils');
const yaml = require('js-yaml');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  let lint = path.resolve(__dirname, '../node_modules/.bin/eslint');
  let configFile = path.resolve(__dirname, './.eslintrc.yml');
  opts.env = opts.env || 'browser,node';
  opts.source = opts.source || './lib ./src ./app';
  opts.ext = opts.ext || '.js,.jsx';
  opts.global = opts.global || '$,jQuery';
  opts.ignore = opts.ignore || [];

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    if (opts.disabled) {
      next();
      return;
    }

    let source = path.resolve(this.cwd, opts.source);
    let ignores = utils.isArray(opts.ignore) ? opts.ignore : [opts.ignore];
    let ignoreText = ignores.map(item => (`--ignore-pattern ${item}`)).join(' ');

    //复制到项目根目录
    let yamlFile = path.normalize(`${this.cwd}/.eslintrc.yml`);
    let yamlText = await this.utils.readFile(configFile);
    await this.utils.writeFile(yamlFile, yamlText);
    let jsonText = JSON.stringify(yaml.safeLoad(yamlText.toString(), 'utf8'), null, '  ');
    let jsonFile = path.normalize(`${this.cwd}/.eslintrc.json`);
    await this.utils.writeFile(jsonFile, jsonText);

    this.console.info('执行静态检查...');
    /* eslint-disable */
    await this.utils.exec(`
      ${lint} -c ${configFile} --global ${opts.global} ${ignoreText} --env ${opts.env} --ext ${opts.ext} ${source} --fix
    `);
    /* eslint-enable */
    this.console.info('完成');

    next();

  };

};