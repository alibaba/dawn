/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const configs = require('./configs');
const utils = require('ntils');
const extract = require('./common/extract');
const mod = require('./mod');
const globby = require('globby');
const rename = require('./common/rename');
const fs = require('fs');
const copydir = require('./common/copydir');
const path = require('path');
const debug = require('debug')('template');
const pkgname = require('./common/pkgname');

exports.list = async function () {
  const templates = [];
  const confMap = await configs.getRemoteConf('template');
  let nameMaxLen = 0;
  if (!utils.isObject(confMap)) return templates;
  utils.each(confMap, (name, item) => {
    if (!item) return;
    item.name = item.name || name;
    if (!item.name) return;
    if (item.name.length > nameMaxLen) {
      nameMaxLen = item.name.length;
    }
    templates.push(item);
  });
  templates.nameMaxLen = nameMaxLen;
  return templates;
};

exports.search = async function (keyword) {
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
  const prefix = await configs.getRc('templatePrefix');
  const list = await this.list();
  let nameInfo = pkgname(name, prefix);
  const aliasItem = list.find(item => item.name === nameInfo.name ||
    item.name === nameInfo.shortName);
  debug('aliasItem', name, aliasItem);
  if (aliasItem && aliasItem.location) {
    nameInfo = pkgname(aliasItem.location, prefix);
  }
  return nameInfo;
};

exports.renameFiles = async function (target, suffix) {
  suffix = suffix || 'rename';
  const files = await globby([`./**/*.${suffix}`, '!./node_modules/**/*.*'], {
    cwd: target || process.cwd(),
    dot: true
  });
  return Promise.all(files.map(srcFile => {
    const dstFile = srcFile.slice(0, srcFile.length - suffix.length - 1);
    if (dstFile.length < 1 ||
      !fs.existsSync(srcFile)) {
      return;
    }
    return rename(srcFile, dstFile);
  }));
};

exports.download = async function (name, target) {
  debug('download', name, target);
  const prefix = await configs.getRc('templatePrefix');
  const filename = await mod.download(name, prefix);
  if (!filename) throw new Error('Download error:', name);
  debug('download done', filename, target);
  return extract(filename, target, 1);
};

exports.getDocUrl = async function (name) {
  const prefix = await configs.getRc('templatePrefix');
  return mod.getDocUrl(name, prefix);
};

exports.init = async function (name, cwd) {
  cwd = cwd || process.cwd();
  debug('init', name, cwd);
  const nameInfo = await this.getInfo(name);
  let result;
  try {
    if (nameInfo.isPath) {
      const src = path.resolve(cwd, nameInfo.name);
      result = await copydir(src, cwd);
    } else {
      result = await this.download(nameInfo.fullNameAndVersion, cwd);
    }
  } catch (err) {
    throw err;
  }
  await this.renameFiles(cwd, 'rename');
  await this.renameFiles(cwd, 'template');
  return result;
};