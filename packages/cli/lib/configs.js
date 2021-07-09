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
const console = require('./common/console');
const utils = require('./common/utils');
const trim = require('./common/trim');
const paths = require('./common/paths');

const FETCH_TIMEOUT = 30000;

exports.setLocalRc = async function (name, value) {
  const rcObject = (await this.getLocalRc()) || {};
  rcObject[name] = value;
  const text = yaml.stringify(rcObject);
  const rcFile = paths.rcPath();
  return await writeFile(rcFile, text);
};

exports.getLocalRc = async function (name) {
  const rcFile = paths.rcPath();
  if (!fs.existsSync(rcFile)) return name ? '' : {};
  const text = await readFile(rcFile);
  const rcObject = yaml.parse(text) || {};
  const value = name ? rcObject[name] || '' : rcObject;
  debug('getLocalRc', name || 'all', value || '<null>');
  return utils.isString(value) ? value.trim() : value;
};

exports.getRemoteRc = async function (name) {
  const remoteRCConf = (await this.getRemoteConf('rc')) || {};
  const value = name ? remoteRCConf[name] || '' : remoteRCConf;
  debug('getRemoteRc', name || 'all', value || '<null>');
  return utils.isString(value) ? value.trim() : value;
};

exports.getProjectRc = async function (name) {
  const configsPath = path.resolve(process.cwd(), './.dawn');
  const configs = utils.confman.load(configsPath);
  const rcObject = configs.rc || {};
  const value = name ? rcObject[name] || '' : rcObject;
  debug('getProjectRc', name || 'all', value || '<null>');
  return utils.isString(value) ? value.trim() : value;
};

exports.getRc = async function (name, opts) {
  opts = Object.assign({}, opts);
  const value =
    (await this.getProjectRc(name)) ||
    (await this.getLocalRc(name)) ||
    (opts.remote !== false && (await this.getRemoteRc(name))) ||
    pkg.configs[name] ||
    '';
  debug('getRc', name, value || '<null>');
  return utils.isString(value) ? value.trim() : value;
};

exports.getServerUri = async function () {
  const serverUri =
    (await this.getProjectRc('server')) || (await this.getLocalRc('server')) || pkg.configs.server || '';
  debug('getServerUri', serverUri || '<null>');
  return utils.isString(serverUri) ? trim(serverUri.trim(), '/') : '';
};

exports.getRemoteConf = async function (name, defaultValue = {}) {
  const serverUri = await this.getServerUri();
  const url = `${serverUri}/${name}.yml`;
  debug('Remote conf URI:', url);
  const cacheInfo = await cache.get(url);
  if (cacheInfo.isExists && !cacheInfo.isExpire) {
    return yaml(cacheInfo.value) || defaultValue;
  }
  let res;
  try {
    res = await fetch(url, { timeout: FETCH_TIMEOUT });
  } catch (err) {
    console.warn(err.message);
    return cacheInfo.isExists ? yaml(cacheInfo.value) : defaultValue;
  }
  if (res.status < 200 || res.status > 299) {
    return cacheInfo.isExists ? yaml(cacheInfo.value) : defaultValue;
  }
  const text = await res.text();
  await cache.set(name, text);
  return yaml(text) || defaultValue;
};

exports.getLocalConf = async function (name, defaultValue = {}) {
  const localStoreDir = await store.getPath('configs');
  const filename = path.normalize(`${localStoreDir}/${name}.json`);
  if (!fs.existsSync(filename)) return defaultValue;
  const text = await readFile(filename);
  return JSON.parse(text);
};

exports.setLocalConf = async function (name, value) {
  const localStoreDir = await store.getPath('configs');
  const filename = path.normalize(`${localStoreDir}/${name}.json`);
  const text = JSON.stringify(value);
  await writeFile(filename, text);
};
