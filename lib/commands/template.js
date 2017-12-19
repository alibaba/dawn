/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const template = require('../template');
const rightpad = require('rightpad');
const utils = require('../common/utils');
const leftpad = require('leftpad');
const console = require('../common/console');

async function show() {
  let keyword = this.get('$1');
  let list = await template.search(keyword);
  let count = list.length;
  if (count < 1) return console.warn('Cannot find templates');
  let name = await utils.prompt.pick({
    message: `Found ${count} templates`,
    choices: list.map((item, index) => ({
      name: `${leftpad(index + 1, count.toString().length)}. ${rightpad(item.name, list.nameMaxLen)} : ${item.summary}`,
      value: item.name
    }))
  });
  let item = list.find(item => item.name == name);
  item.doc = item.doc || await template.getDocUrl(item.location || item.name);
  utils.open(item.doc, { wait: false });
  show.call(this);
}

module.exports = show;