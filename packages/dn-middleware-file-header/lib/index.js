/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

const globby = require('globby');
const stp = require('stp');
const os = require('os');
const path = require('path');
const fs = require('fs');
const utils = require('ntils');

/**
 * 这是一个标准的中间件工程模板
 * @param {object} opts cli 传递过来的参数对象 (在 pipe 中的配置)
 * @return {AsyncFunction} 中间件函数
 */
module.exports = function (opts) {

  opts = opts || {};
  opts.files = opts.files || ['./src/**/*.js', './lib/**/*.js'];
  opts.text = opts.text || [];

  if (!utils.isArray(opts.text)) {
    opts.text = [opts.text];
  }

  return async function (next) {

    this.console.log('Add file header...');
    let scope = {};
    let pkgFile = path.normalize(`${this.cwd}/package.json`);
    if (fs.existsSync(pkgFile)) scope = require(pkgFile);
    let text = opts.text.map(line => ` * ${line}`).join(os.EOL);
    let comment = ['/**', stp(text)(scope), ' */'].join(os.EOL);
    let files = await globby(opts.files);
    let handle = async file => {
      let oldContent = (await this.utils.readFile(file)).toString().trim();
      if (oldContent.startsWith('/**')) {
        oldContent = oldContent.replace(/\/\*\*[\s\S]+?\*\//, '').trim();
      }
      let newContent = [comment, oldContent].join(os.EOL + os.EOL);
      await this.utils.writeFile(file, newContent);
    };
    await Promise.all(files.map(file => handle(file)));
    this.console.info('Done');
    next();

  };

};