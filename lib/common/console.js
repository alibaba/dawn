/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const console = require('console3');
const utils = require('ntils');
const { colors } = console;

['log', 'info', 'warn', 'error'].forEach(name => {
  let func = console[name];
  console[name] = function (...args) {
    let text = [...args].join('').trim();
    if (text && !text.includes('\n')) {
      let time = utils.formatDate(new Date(), 'hh:mm:ss');
      console.write(colors.blue(`[${time}] `));
    }
    func.call(console, ...args);
  };
});

module.exports = console;