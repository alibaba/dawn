const fs = require('fs');
const path = require('path');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  const envOpts = JSON.parse(decodeURIComponent(process.env['DN_ARGV'] || '{}'));
  const pkgEnv = envOpts.pkginfo || {};

  // 是否为静默模式
  const silenceMode = !!pkgEnv.silence;

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    if (!this.inquirer) {
      throw new Error('请升级 dawn 到最新版本');
    }
    const defaultPkgName = (opts && opts.endpoint || '') + path.basename(this.cwd);

    opts.items = opts.items || [{
      name: 'name',
      type: 'input',
      default: defaultPkgName,
      message: '请输入项目名称',
      validate: function (name) {
        return !!name;
      }
    }, {
      name: 'version',
      type: 'input',
      message: '请输入初始版本',
      default: '1.0.0',
      validate: function (version) {
        return !!version;
      }
    }, {
      name: 'description',
      type: 'input',
      message: '请输入项目描述'
    }];

    let pkgFile = `${this.cwd}/package.json`;
    if (fs.existsSync(pkgFile)) {
      this.console.info('设定项目信息...');
      let pkg = require(pkgFile);
      let result = {};
      if (!silenceMode) {
        result = await this.inquirer.prompt(opts.items);
      } else {
        this.console.info('静默模式...', JSON.stringify(pkgEnv));
        opts.items.map(({ name, default: defaultValue }) => {
          result[name] = pkgEnv[name] || defaultValue || '';
        })
      }
      Object.assign(pkg, result);
      this.project = pkg;
      await this.utils.writeFile(pkgFile, JSON.stringify(pkg, null, '  '));
      this.console.info('完成');
    }
    next();
  };

};