/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
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