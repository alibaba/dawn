/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const template = require('../template');
const rightpad = require('rightpad');
const prompt = require('../common/prompt');
const leftpad = require('leftpad');
const debug = require('debug')('init');

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

module.exports = async function (next) {
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
  await template.init(templateName, this.cwd);
  this.console.info('Done');
  return next();
};