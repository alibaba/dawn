/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const Stamp = require('./stamp');
const store = require('./store');
const readFile = require('./common/readfile');
const writeFile = require('./common/writefile');
const path = require('path');
const fs = require('fs');
const debug = require('debug')('cache');

exports.getFile = async function (name) {
  const cacheDir = await store.getPath('caches');
  return path.normalize(`${cacheDir}/${name}.cache`);
};

exports.getStamp = async function (name) {
  return new Stamp(`${name}.cache`);
};

exports.get = async function (name) {
  debug('get', 'name', name);
  const stamp = await this.getStamp(name);
  const filename = await this.getFile(name);
  debug('get', 'filename', filename);
  const isExists = fs.existsSync(filename);
  debug('get', 'isExists', isExists);
  const isExpire = await stamp.isExpire();
  debug('get', 'isExpire', isExpire);
  const value = isExists ? await readFile(filename) : null;
  return { isExists, isExpire, value };
};

exports.set = async function (name, value) {
  debug('set', 'name', name);
  const stamp = await this.getStamp(name);
  const filename = await this.getFile(name);
  debug('set', 'filename', filename);
  await Promise.all([
    writeFile(filename, value),
    stamp.write()
  ]);
};