/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const template = require('../template');
const rightpad = require('rightpad');
const utils = require('../common/utils');
const leftpad = require('leftpad');
const console = require('console3');

async function show() {
  let keyword = this.get('$1');
  let list = await template.search(keyword);
  let count = list.length;
  if (count < 1) return console.warn('No tempate found');
  let name = await utils.prompt.pick({
    message: `Found ${count} templates`,
    choices: list.map((item, index) => ({
      name: `${leftpad(index + 1, count.toString().length)}. ${rightpad(item.name, list.nameMaxLen)} : ${item.summary}`,
      value: item.name
    }))
  });
  let item = list.find(item => item.name == name);
  if (item.doc) {
    utils.open(item.doc, { wait: false });
  } else {
    console.warn('Doc cannot be found');
  }
  show.call(this);
}

module.exports = show;