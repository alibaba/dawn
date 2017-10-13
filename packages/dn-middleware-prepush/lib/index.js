const fs = require('fs');

module.exports = function () {

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    let targetDir = `${this.cwd}/.git/hooks`;
    let targetFile = `${targetDir}/pre-push`;
    if (fs.existsSync(targetDir)) {
      if (!fs.existsSync(targetFile)) {
        let buffer = await this.utils.readFile(`${__dirname}/pre-push.sh`);
        await this.utils.writeFile(targetFile, buffer);
        fs.chmodSync(targetFile, '777');
        this.console.info('成功创建 pre-push');
      } else {
        this.console.warn('找到存在的 pre-push');
      }
    } else {
      this.console.warn('当前目录不是 Git Repo');
    }
    next();

  };

};