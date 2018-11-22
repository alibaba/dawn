const path = require('path');
const utils = require('ntils');
const yaml = require('js-yaml');
const globby = require('globby');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts.env = opts.env || 'browser,node';
  opts.source = opts.source || ['./src', './lib', './app'];
  opts.ext = opts.ext || '.js,.jsx';
  opts.global = opts.global || 'window,$,jQuery';
  opts.ignore = opts.ignore || [];

  const eslint = this.utils.findCommand(__dirname, 'eslint');
  const rulesFile = path.resolve(__dirname, './.eslintrc.yml');

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    this.console.info('执行静态检查...');

    //安装规范包
    await this.mod.install('eslint-config-dawn');
    await this.mod.install('eslint-plugin-react');
    await this.mod.install('eslint-plugin-html');
    await this.mod.install('babel-eslint');

    const sources = (utils.isArray(opts.source) ? opts.source : [opts.source])
      .filter(dir => globby.sync(`${dir}/**/*.{js,jsx}`).length > 0);
    if (sources.length < 1) return next();
    this.console.log('检查目标', sources.join(', '));

    const ignores = utils.isArray(opts.ignore) ? opts.ignore : [opts.ignore];
    const ignoreText = ignores.map(item =>
      (`--ignore-pattern ${item}`)
    ).join(' ');

    //读取内建规则
    const rulesText = await this.utils.readFile(rulesFile);
    const rules = yaml.safeLoad(rulesText.toString(), 'utf8');
    this.emit('lint.rules', rules);
    //向项目写入 yaml 配置
    const yamlFile = path.normalize(`${this.cwd}/.eslintrc.yml`);
    const yamlText = yaml.safeDump(rules);
    await this.utils.writeFile(yamlFile, yamlText);
    //向项目写入 json 配置
    const jsonFile = path.normalize(`${this.cwd}/.eslintrc.json`);
    const jsonText = JSON.stringify(rules, null, '  ');
    await this.utils.writeFile(jsonFile, jsonText);

    /* eslint-disable */
    await this.utils.exec([
      eslint, '--global', opts.global, ignoreText, '--env', opts.env,
      '--ext', opts.ext, , sources.join(' '), '--fix'
    ].join(' '));
    /* eslint-enable */
    this.console.info('完成');

    next();

  };

};