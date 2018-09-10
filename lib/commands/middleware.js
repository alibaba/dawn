/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const middleware = require('../middleware');
const rightpad = require('rightpad');
const utils = require('../common/utils');
const leftpad = require('leftpad');
const console = require('../common/console');
const shorten = require('../common/shorten');

async function show() {
  const keyword = this.get('$1');
  const list = await middleware.search(keyword);
  if (!list) return;
  const count = list.length;
  if (count < 1) return console.warn('Cannot find middlewares');
  const name = await utils.prompt.pick({
    message: `Found ${count} middlewares`,
    choices: list.map((item, index) => {
      const no = leftpad(index + 1, count.toString().length);
      const name = rightpad(item.name, list.nameMaxLen);
      const summary = shorten(item.summary, 30);
      return { name: `${no}. ${name} : ${summary}`, value: item.name };
    })
  });
  const item = list.find(item => item.name == name);
  item.doc = item.doc || await middleware
    .getDocUrl(item.location || item.name);
  utils.open(item.doc, { wait: false });
  show.call(this);
}

module.exports = show;