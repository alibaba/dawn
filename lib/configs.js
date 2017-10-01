/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const pkg = require('../package');
const fetch = require('./common/fetch');
const yaml = require('./common/yaml');
const fs = require('fs');
const path = require('path');
const readFile = require('./common/readfile');
const writeFile = require('./common/writefile');
const cache = require('./cache');
const store = require('./store');
const debug = require('debug')('config');
const console = require('console3');
const utils = require('./common/utils');
const trim = require('./common/trim');
const paths = require('./common/paths');

const FETCH_TIMEOUT = 30000;

exports.setLocalRc = async function (name, value) {
  let rcObject = await this.getLocalRc() || {};
  rcObject[name] = value;
  let text = yaml.stringify(rcObject);
  let rcFile = paths.rcPath();
  return await writeFile(rcFile, text);
};

exports.getLocalRc = async function (name) {
  let rcFile = paths.rcPath();
  if (!fs.existsSync(rcFile)) return name ? '' : {};
  let text = await readFile(rcFile);
  let rcObject = yaml.parse(text) || {};
  let value = name ? rcObject[name] || '' : rcObject;
  debug('getLocalRc', name || 'all', value || '<null>');
  return utils.isString(value) ? value.trim() : value;
};

exports.getRemoteRc = async function (name) {
  let remoteRCConf = await this.getRemoteConf('rc') || {};
  let value = name ? remoteRCConf[name] || '' : remoteRCConf;
  debug('getRemoteRc', name || 'all', value || '<null>');
  return utils.isString(value) ? value.trim() : value;
};

exports.getRc = async function (name, opts) {
  opts = Object.assign({}, opts);
  let value = await this.getLocalRc(name) ||
    (opts.remote !== false && await this.getRemoteRc(name)) ||
    pkg.configs[name] || '';
  debug('getRc', name, value || '<null>');
  return utils.isString(value) ? value.trim() : value;
};

exports.getServerUri = async function () {
  let serverUri = await this.getLocalRc('server') ||
    pkg.configs.server || '';
  debug('getServerUri', serverUri || '<null>');
  return utils.isString(serverUri) ?
    trim(serverUri.trim(), '/') : '';
};

exports.getRemoteConf = async function (name, defaultValue) {
  let cacheInfo = await cache.get(name);
  if (cacheInfo.isExists && !cacheInfo.isExpire) {
    return yaml(cacheInfo.value);
  }
  let serverUri = await this.getServerUri();
  let url = `${serverUri}/${name}.yml`;
  debug('Remote conf URI:', url);
  let res;
  try {
    res = await fetch(url, { timeout: FETCH_TIMEOUT });
  } catch (err) {
    console.warn(err.message);
    return (cacheInfo.isExists ? yaml(cacheInfo.value) : defaultValue) || {};
  }
  if (res.status < 200 || res.status > 299) {
    return (cacheInfo.isExists ? yaml(cacheInfo.value) : defaultValue) || {};
  }
  let text = await res.text();
  await cache.set(name, text);
  return yaml(text);
};

exports.getLocalConf = async function (name, defaultValue) {
  let localStoreDir = await store.getPath('configs');
  let filename = path.normalize(`${localStoreDir}/${name}.json`);
  if (!fs.existsSync(filename)) return defaultValue || {};
  let text = await readFile(filename);
  return JSON.parse(text);
};

exports.setLocalConf = async function (name, value) {
  let localStoreDir = await store.getPath('configs');
  let filename = path.normalize(`${localStoreDir}/${name}.json`);
  let text = JSON.stringify(value);
  await writeFile(filename, text);
};