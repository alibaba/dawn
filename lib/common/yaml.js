/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const yaml = require('js-yaml');

function parse(text) {
  return yaml.safeLoad(text, 'utf8');
}

function stringify(obj) {
  return yaml.safeDump(obj);
}

parse.parse = parse;
parse.stringify = stringify;

module.exports = parse;