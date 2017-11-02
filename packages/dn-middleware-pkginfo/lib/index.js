const fs = require('fs');
const path = require('path');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function () {

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    if (!this.inquirer) {
      throw new Error('请升级 dawn 到最新版本');
    }

    let pkgFile = `${this.cwd}/package.json`;
    if (fs.existsSync(pkgFile)) {
      this.console.info('设定项目信息...');
      let pkg = require(pkgFile);
      let result = await this.inquirer.prompt([{
        name: 'name',
        type: 'input',
        default: path.basename(this.cwd),
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
      }]);
      pkg.name = result.name;
      pkg.version = result.version;
      pkg.description = result.description;
      await this.utils.writeFile(pkgFile, JSON.stringify(pkg, null, '  '));
      this.console.info('完成');
    }
    next();
  };

};