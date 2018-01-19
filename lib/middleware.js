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
const pkgname = require('./common/pkgname');

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
  if (!utils.isString(name)) return name;
  debug('get', name);
  let prefix = await configs.getRc('middlewarePrefix');
  let nameInfo = pkgname(name, prefix);
  let list = await this.list();
  return list.find(item => item.name === nameInfo.name ||
    item.name === nameInfo.shortName);
};

exports.getDocUrl = async function (name) {
  let prefix = await configs.getRc('middlewarePrefix');
  return mod.getDocUrl(name, prefix);
};

exports.require = async function (name, cwd) {
  cwd = cwd || process.cwd();
  debug('require', name, cwd);
  let prefix = await configs.getRc('middlewarePrefix');
  let nameInfo = pkgname(name, prefix);
  let mdModule;
  if (nameInfo.isPath) {
    mdModule = require(path.resolve(cwd, nameInfo.name));
  } else {
    let remoteConf = await this.get(nameInfo.name);
    if (remoteConf && remoteConf.location) {
      nameInfo.opts.name = remoteConf.location;
    }
    let packagePath = path
      .normalize(`${cwd}/node_modules/${nameInfo.fullName}`);
    if (!fs.existsSync(packagePath)) {
      await mod.install(nameInfo.fullNameAndVersion, {
        flag: { 'no-save': true },
        prefix: prefix
      });
    }
    mdModule = require(packagePath);
  }
  return mdModule && nameInfo.member ?
    mdModule[nameInfo.member] : mdModule;
};