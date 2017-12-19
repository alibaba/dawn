/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const middleware = require('../middleware');
const rightpad = require('rightpad');
const utils = require('../common/utils');
const leftpad = require('leftpad');
const console = require('../common/console');

async function show() {
  let keyword = this.get('$1');
  let list = await middleware.search(keyword);
  let count = list.length;
  if (count < 1) return console.warn('Cannot find middlewares');
  let name = await utils.prompt.pick({
    message: `Found ${count} middlewares`,
    choices: list.map((item, index) => ({
      name: `${leftpad(index + 1, count.toString().length)}. ${rightpad(item.name, list.nameMaxLen)} : ${item.summary}`,
      value: item.name
    }))
  });
  let item = list.find(item => item.name == name);
  item.doc = item.doc || await middleware.getDocUrl(item.location || item.name);
  utils.open(item.doc, { wait: false });
  show.call(this);
}

module.exports = show;