/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const configs = require('./configs');
const utils = require('ntils');
const path = require('path');
const mod = require('./mod');
const debug = require('debug')('middleware');
const fs = require('fs');

exports.list = async function () {
  let middlewares = [];
  let nameMaxLen = 0;
  let confMap = await configs.getRemoteConf('middleware');
  utils.each(confMap, (name, item) => {
    item.name = item.name || name;
    if (item.name.length > nameMaxLen) {
      nameMaxLen = item.name.length;
    }
    middlewares.push(item);
  });
  middlewares.nameMaxLen = nameMaxLen;
  return middlewares;
};

exports.search = async function (keyword) {
  debug('search', keyword);
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
  debug('get', name);
  if (!utils.isString(name)) return name;
  let list = await this.list();
  return list.find(item => item.name === name);
};

exports.require = async function (name, cwd) {
  cwd = cwd || process.cwd();
  debug('require', name, cwd);
  if (mod.isFolder(name)) {
    return require(path.resolve(cwd, name));
  }
  let remoteConf = await this.get(name);
  if (remoteConf && remoteConf.location) {
    name = remoteConf.location;
  }
  let prefix = await configs.getRc('middlewarePrefix');
  let trimedName = mod.parseName(name, prefix).fullName;
  let packagePath = path.normalize(`${cwd}/node_modules/${trimedName}`);
  if (!fs.existsSync(packagePath)) {
    await mod.install(name, {
      flag: { 'no-save': true },
      prefix: prefix
    });
  }
  return require(packagePath);
};