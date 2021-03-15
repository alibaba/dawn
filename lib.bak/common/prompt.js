/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const inquirer = require('inquirer');

exports.pick = async function (opts) {
  opts = opts || {};
  opts.type = 'list';
  opts.name = 'selected';
  opts.message = opts.message || opts.title;
  opts.choices = opts.choices || opts.items;
  opts.pageSize = opts.pageSize || 9;
  const answer = await inquirer.prompt([opts]);
  return answer.selected;
};