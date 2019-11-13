const path = require('path');
const fs = require('fs');
const utils = require('ntils');
const yaml = require('js-yaml');
const globby = require('globby');

function modifyRulesConfig(opts, rules) {
  // env
  rules.env = {};
  opts.env.split(',').forEach(e => {
    rules.env[e] = true;
  });
  // globals
  rules.globals = {};
  opts.global.split(',').forEach(g => {
    rules.globals[g] = 'writable';
  });
}

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
  opts.realtime = opts.realtime || false;

  const eslint = this.utils.findCommand(__dirname, 'eslint');
  const rulesFile = path.resolve(__dirname, './.eslintrc.yml');

  // 外层函数的用于接收「参数对象」
  // 必须返回一个中间件处理函数
  return async function (next) {

    

    const isInstalled = (name) => {
      return fs.existsSync(path.normalize(`${this.cwd}/node_modules/${name}`));
    };
    // 安装规范包
    const flag = { 'save-dev': true };
    const deps = [
      'eslint-config-dawn', 'eslint-plugin-react', 'eslint-plugin-react-hooks',
      'eslint-plugin-html', 'babel-eslint'
    ];
    for (let dep of deps) {
      if (!isInstalled(dep)) await this.mod.install(dep, { flag });
    }

    const sources = (utils.isArray(opts.source) ? opts.source : [opts.source])
      .filter(dir => globby.sync(`${dir}/**/*.{js,jsx}`).length > 0);
    if (sources.length < 1) return next();
    // this.console.log('检查目标', sources.join(', '));

    const ignores = utils.isArray(opts.ignore) ? opts.ignore : [opts.ignore];
    const ignoreText = ignores.map(item =>
      (`--ignore-pattern ${item}`)
    ).join(' ');

    // 读取内建规则
    const rulesText = await this.utils.readFile(rulesFile);
    const rules = yaml.safeLoad(rulesText.toString(), 'utf8');

    modifyRulesConfig(opts, rules);
    this.emit('lint.rules', rules);

    // 向项目写入 yaml 配置
    const yamlFile = path.normalize(`${this.cwd}/.eslintrc.yml`);
    const yamlText = yaml.safeDump(rules);
    await this.utils.writeFile(yamlFile, yamlText);

    // 不再向项目写入 json 配置覆盖
    // const jsonFile = path.normalize(`${this.cwd}/.eslintrc.json`);
    // const jsonText = JSON.stringify(rules, null, '  ');
    // await this.utils.writeFile(jsonFile, jsonText);
    
    // 删除暂时不需要的 .eslintrc.json
    this.utils.del(path.normalize(`${this.cwd}/.eslintrc.json`));

    if (opts.realtime) {
      const eslintLoader = {
        test: /\.(js|jsx)$/,
        include: path.resolve(this.cwd, 'src'),
        exclude: /node_modules/,
        enforce: 'pre',
        loader: [{
          loader: require.resolve('eslint-loader'),
          options: {
            cache: true,
            formatter: 'stylish',
          },
        }],
      };
      this.on('webpack.config', (webpackConf) => {
        if (Array.isArray(webpackConf.module.loaders)) {
          webpackConf.module.loaders.unshift(eslintLoader);
        } else {
          // eslint-disable-next-line no-param-reassign
          webpackConf.module.loaders = [eslintLoader];
        }
      });
    } else {
      this.console.info('执行静态检查...');
      /* eslint-disable */
      await this.utils.exec([
        eslint, '--global', opts.global, ignoreText, '--env', opts.env,
        '--ext', opts.ext, , sources.join(' '), '--fix'
      ].join(' '));
      /* eslint-enable */
      this.console.info('lint 检查完成');
    }
    next();
  };

};