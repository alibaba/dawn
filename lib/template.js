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
  debug('get', name);
  let prefix = await configs.getRc('templatePrefix');
  let nameInfo = pkgname(name, prefix);
  let list = await this.list();
  return list.find(item => item.name === nameInfo.name ||
    item.name === nameInfo.shortName);
};

exports.renameFiles = async function (target, suffix) {
  suffix = suffix || 'rename';
  let files = await globby([`./**/*.${suffix}`, '!./node_modules/**/*.*'], {
    cwd: target || process.cwd(),
    dot: true
  });
  return Promise.all(files.map(srcFile => {
    let dstFile = srcFile.slice(0, srcFile.length - suffix.length - 1);
    if (dstFile.length < 1 ||
      !fs.existsSync(srcFile)) {
      return;
    }
    return rename(srcFile, dstFile);
  }));
};

exports.download = async function (name, target) {
  debug('download', name, target);
  let remoteConf = await this.get(name);
  debug('remoteConf', name, remoteConf);
  if (remoteConf && remoteConf.location) {
    nameInfo.opts.name = remoteConf.location;
  }
  let prefix = await configs.getRc('templatePrefix');
  let filename = await mod.download(name, prefix);
  if (!filename) throw new Error('Download error:', name);
  debug('download done', filename, target);
  return extract(filename, target, 1);
};

exports.getDocUrl = async function (name) {
  let prefix = await configs.getRc('templatePrefix');
  return mod.getDocUrl(name, prefix);
};

exports.init = async function (name, cwd) {
  cwd = cwd || process.cwd();
  debug('init', name, cwd);
  let prefix = await configs.getRc('templatePrefix');
  let nameInfo = pkgname(name, prefix);
  let result;
  try {
    if (nameInfo.isPath) {
      let src = path.resolve(cwd, nameInfo.name);
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