/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const template = require('../template');
const rightpad = require('rightpad');
const prompt = require('../common/prompt');
const leftpad = require('leftpad');
const shorten = require('../common/shorten');
const debug = require('debug')('init');

async function pickTemplate(list) {
  const count = list.length;
  if (count < 1) return;
  return await prompt.pick({
    message: `Found ${count} templates`,
    choices: list.map((item, index) => {
      const no = leftpad(index + 1, count.toString().length);
      const name = rightpad(item.name, list.nameMaxLen);
      const summary = shorten(item.summary, 30);
      return { name: `${no}. ${name} : ${summary}`, value: item.name };
    })
  });
}

module.exports = async function (next) {
  const force = this.cli.get('force');
  if (!force && !process.env.DEBUG && await this.configIsExists()) {
    throw new Error(`The directory '${this.cwd}' has been initialized`);
  }
  let templateName = this.cli.get('template');
  if (!templateName) {
    const keyword = this.cli.get('$1');
    debug('keyword', keyword);
    const templateList = await template.search(keyword);
    templateName = await pickTemplate(templateList);
  }
  if (!templateName) {
    return this.console.warn('Cannot find template');
  }
  this.console.info('Initializing template...');
  await template.init(templateName, this.cwd);
  this.console.info('Done');
  return next();
};