/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const template = require('../template');
const rightpad = require('rightpad');
const prompt = require('../common/prompt');
const leftpad = require('leftpad');
const globby = require('globby');
const rename = require('../common/rename');
const debug = require('debug')('init');
const fs = require('fs');

async function pickTemplate(list) {
  let count = list.length;
  if (count < 1) return;
  return await prompt.pick({
    message: `Found ${count} templates`,
    choices: list.map((item, index) => ({
      name: `${leftpad(index + 1, count.toString().length)}. ${rightpad(item.name, list.nameMaxLen)} : ${item.summary}`,
      value: item.name
    }))
  });
}

async function renameFiles(target, suffix) {
  suffix = suffix || 'rename';
  let files = await globby([`./**/*.${suffix}`, '!./node_modules/**/*.*'], {
    cwd: target || process.cwd(),
    dot: true
  });
  return Promise.all(files.map(srcFile => {
    let dstFile = srcFile.slice(0, srcFile.length - suffix.length - 1);
    if (dstFile.length < 1 ||
      !fs.existsSync(srcFile)) {
      return;
    }
    return rename(srcFile, dstFile);
  }));
}

module.exports = async function () {
  if (await this.configIsExists() && !process.env.DEBUG) {
    throw new Error(`The directory '${this.cwd}' has been initialized`);
  }
  let templateName = this.cli.get('template');
  if (!templateName) {
    this.console.info('Load template information...');
    let keyword = this.cli.get('$1');
    debug('keyword', keyword);
    let templateList = await template.search(keyword);
    this.console.info('Done');
    templateName = await pickTemplate(templateList);
  }
  if (!templateName) {
    return this.console.warn('No template found');
  }
  this.console.info('Init template...');
  await template.extract(templateName, this.cwd);
  await renameFiles(this.cwd, 'rename');
  await renameFiles(this.cwd, 'template');
  debug('configPath', this.configPath);
  await this.utils.mkdirp(this.configPath);
  this.console.info('Done');
  this.middlewares = [];
  await this.run();
};