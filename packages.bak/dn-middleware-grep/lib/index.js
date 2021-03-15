const globby = require('globby');
const grep = require('./grep');
const os = require('os');
const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts.src = opts.src || './build/**/*.js';
  opts.mode = opts.mode || 'exclude';

  //外层函数的用于接收「参数对象」
  //必须返回一个中间件处理函数
  return async function (next) {

    let rcContent = '';
    let commonRCFile = path.normalize(`${__dirname}/.greprc`);
    let localRCFile = path.normalize(`${this.cwd}/.greprc`);
    if (fs.existsSync(localRCFile)) {
      rcContent = await this.utils.readFile(localRCFile);
    } else {
      rcContent = await this.utils.readFile(commonRCFile);
    }
    rc = yaml.safeLoad(rcContent, 'utf8');

    var scanFile = async (file) => {
      let code = await this.utils.readFile(file);
      return await grep.scan(code.toString(), rc.words);
    };

    let result = Object.create(null);

    let files = await globby(opts.src);
    await Promise.all(files.map(file => {
      return (async () => {
        let messages = await scanFile(file);
        if (messages.length < 1) return;
        result[file] = messages.map(msg => `  ${msg}`);
      })();
    }));

    this.utils.each(result, (file, messages) => {
      this.console.log('');
      this.console.log(file);
      this.console.warn(messages.join(os.EOL));
      this.console.log('');
    });

    let fileCount = Object.keys(result).length;
    if ((fileCount > 0 && opts.mode == 'exclude') ||
      (fileCount < 1 && opts.mode == 'include')) {
      throw new Error(`查找模式为 ${opts.mode}，在 ${fileCount} 个文件中找到`);
    }

    next();

  };

};