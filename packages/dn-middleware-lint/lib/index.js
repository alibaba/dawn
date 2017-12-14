const path = require('path');
const utils = require('ntils');
const yaml = require('js-yaml');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts.env = opts.env || 'browser,node';
  opts.source = opts.source || './lib ./src ./app ./demo';
  opts.ext = opts.ext || '.js,.jsx';
  opts.global = opts.global || '$,jQuery';
  opts.ignore = opts.ignore || [];

  const lintBin = path.resolve(__dirname, '../node_modules/.bin/eslint');
  const rulesFile = path.resolve(__dirname, './.eslintrc.yml');

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    if (opts.disabled) {
      next();
      return;
    }

    this.console.info('执行静态检查...');    

    let source = path.resolve(this.cwd, opts.source);
    let ignores = utils.isArray(opts.ignore) ? opts.ignore : [opts.ignore];
    let ignoreText = ignores.map(item => (`--ignore-pattern ${item}`)).join(' ');

    //读取内建规则
    let rulesText = await this.utils.readFile(rulesFile);
    let rules = yaml.safeLoad(rulesText.toString(), 'utf8');
    this.emit('lint.rules', rules);
    //向项目写入 yaml 配置
    let yamlFile = path.normalize(`${this.cwd}/.eslintrc.yml`);
    let yamlText = yaml.safeDump(rules);
    await this.utils.writeFile(yamlFile, yamlText);
    //向项目写入 json 配置
    let jsonFile = path.normalize(`${this.cwd}/.eslintrc.json`);
    let jsonText = JSON.stringify(rules, null, '  ');
    await this.utils.writeFile(jsonFile, jsonText);

    /* eslint-disable */
    await this.utils.exec(`
      ${lintBin} --global ${opts.global} ${ignoreText} --env ${opts.env} --ext ${opts.ext} ${source} --fix
    `);
    /* eslint-enable */
    this.console.info('完成');

    next();

  };

};