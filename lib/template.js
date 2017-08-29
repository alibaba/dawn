/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

const configs = require('./configs');
const utils = require('ntils');
const extract = require('./common/extract');
const mod = require('./mod');
const debug = require('debug')('template');

exports.list = async function () {
  let templates = [];
  let nameMaxLen = 0;
  let confMap = await configs.getRemoteConf('template');
  if (!utils.isObject(confMap)) return templates;
  utils.each(confMap, (name, item) => {
    item.name = item.name || name;
    if (item.name.length > nameMaxLen) {
      nameMaxLen = item.name.length;
    }
    templates.push(item);
  });
  templates.nameMaxLen = nameMaxLen;
  return templates;
};

exports.search = async function (keyword) {
  let srcList = await this.list();
  if (!keyword) return srcList;
  let foundList = srcList.filter(item => {
    return item.name.includes(keyword) ||
      item.summary.includes(keyword);
  });
  foundList.nameMaxLen = srcList.nameMaxLen;
  return foundList;
};

exports.get = async function (name) {
  if (!utils.isString(name)) return name;
  let list = await this.list();
  return list.find(item => item.name === name);
};

exports.extract = async function (name, target) {
  let remoteConf = await this.get(name);
  if (remoteConf && remoteConf.location) {
    name = remoteConf.location;
  }
  let prefix = await configs.getRc('templatePrefix');
  let filename = await mod.download(name, prefix);
  if (!filename) throw new Error('Download error:', name);
  debug('extract', filename, target);
  try {
    return await extract(filename, target, 1);
  } catch (err) {
    throw err;
  }
};