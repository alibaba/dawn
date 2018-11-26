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
  const middlewares = [];
  const confMap = await configs.getRemoteConf('middleware');
  let nameMaxLen = 0;
  utils.each(confMap, (name, item) => {
    if (!item) return;
    item.name = item.name || name;
    if (!item.name) return;
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
  const srcList = await this.list();
  if (!keyword) return srcList;
  const foundList = srcList.filter(item => {
    return (item.name && item.name.includes(keyword)) ||
      (item.summary && item.summary.includes(keyword));
  });
  foundList.nameMaxLen = srcList.nameMaxLen;
  return foundList;
};

exports.getInfo = async function (name) {
  if (!utils.isString(name)) return name;
  debug('get', name);
  const prefix = await configs.getRc('middlewarePrefix');
  const nameInfo = pkgname(name, prefix);
  const list = await this.list();
  const aliasItem = list.find(item => item.name === nameInfo.name ||
    item.name === nameInfo.shortName);
  debug('aliasItem', name, aliasItem);
  if (aliasItem && aliasItem.location) {
    const aliasNameInfo = pkgname(aliasItem.location, prefix);
    aliasNameInfo.opts.member = nameInfo.member;
    return aliasNameInfo;
  } else {
    return nameInfo;
  }
};

exports.getDocUrl = async function (name) {
  const prefix = await configs.getRc('middlewarePrefix');
  return mod.getDocUrl(name, prefix);
};

exports.require = async function (name, cwd) {
  cwd = cwd || process.cwd();
  debug('require', name, cwd);
  const nameInfo = await this.getInfo(name);
  let mdModule;
  if (nameInfo.isPath) {
    debug('isPath', nameInfo);
    mdModule = require(path.resolve(cwd, nameInfo.name));
  } else {
    debug('isModule', nameInfo);
    const packagePath = path
      .normalize(`${cwd}/node_modules/${nameInfo.fullName}`);
    debug('packagePath', packagePath);
    if (!fs.existsSync(packagePath)) {
      const prefix = await configs.getRc('middlewarePrefix');
      await mod.install(nameInfo.fullNameAndVersion, {
        flag: { 'save-dev': true }, prefix: prefix
      });
    }
    mdModule = require(packagePath);
  }
  return mdModule && nameInfo.member ? mdModule[nameInfo.member] : mdModule;
};