/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const exec = require('./common/exec');
const path = require('path');
const utils = require('ntils');
const Stamp = require('./stamp');
const download = require('./common/download');
const fs = require('fs');
const del = require('del');
const fetch = require('./common/fetch');
const store = require('./store');
const debug = require('debug')('mod');
const save = require('./common/save');
const configs = require('./configs');
const trim = require('./common/trim');

const CNPM_BIN = path.resolve(__dirname, '../node_modules/.bin/cnpm');
const FETCT_TIMEOUT = 30000;

class PackageName {

  constructor(name, prefix) {
    name = name || '';
    if (name && prefix && !name.startsWith(prefix)) {
      this.name = `${prefix}-${name}`;
    } else {
      this.name = name;
    }
  }

  get fullName() {
    let name = this.name || '';
    if (name && this.scope) {
      return `${this.scope}/${name}`;
    } else {
      return name;
    }
  }

  get fullNameAndVersion() {
    if (this.version) {
      return `${this.fullName}@${this.version}`;
    } else {
      return this.fullName;
    }
  }

}

exports.parseName = function (name, prefix) {
  if (!name) return '';
  if (name.includes('/')) {
    let parts = name.split('/');
    return Object.assign(
      this.parseName(parts[1], prefix),
      { scope: parts[0] }
    );
  } else if (name.includes('@')) {
    let parts = name.split('@');
    return Object.assign(
      this.parseName(parts[0], prefix),
      { version: parts[1] }
    );
  } else {
    return new PackageName(name, prefix);
  }
};

exports.isFolder = function (name) {
  if (!name) return false;
  return name.startsWith('.') ||
    name.startsWith('/') ||
    /^[a-z]+\:/.test(name);
};

exports.exec = async function (cmd, opts) {
  opts = Object.assign({}, opts);
  opts.cwd = opts.cwd || process.cwd();
  opts.flag = opts.flag || {};
  opts.flag.registry = opts.flag.registry || await configs.getRc('registry');
  let flags = [];
  utils.each(opts.flag, (name, value) => {
    let flagName = (name.length > 1 ? '--' : '-') + name;
    let flagValue = utils.isString(value) ? `=${value}` : '';
    flags.push(`${flagName}${flagValue}`);
  });
  let script = `${CNPM_BIN} ${cmd || ''} ${flags.join(' ')}`;
  debug('exec script', script);
  await exec(script, {
    cwd: opts.cwd
  });
};

exports.install = async function (name, opts) {
  opts = Object.assign({}, opts);
  opts.flag = opts.flag || {};
  let pkgFile = path.normalize(`${process.cwd()}/package.json`);
  if (!opts.flag.global && !opts.flag.g && !fs.existsSync(pkgFile)) {
    return;
  }
  let nameInfo = this.parseName(name, opts.prefix);
  delete opts.prefix;
  await this.exec(`i ${nameInfo.fullNameAndVersion || ''}`, opts);
};

exports.getInfo = async function (name) {
  let registryUri = trim(await configs.getRc('registry'), '/');
  debug('serverUri', registryUri);
  let url = `${registryUri}/${name}`;
  debug('getInfo', url);
  let res = await fetch(url, { timeout: FETCT_TIMEOUT });
  let info = await res.json();
  debug('getInfo', 'ok');
  if (!info || !info.versions || info.error) {
    debug('Module Info', info);
    throw new Error(`Module '${name}' was not found`);
  }
  return info;
};

exports.getVersionInfo = async function (name, version) {
  debug('getVersionInfo', name, version);
  let modInfo = await this.getInfo(name) || {};
  let distTags = modInfo['dist-tags'] || {};
  version = version || 'latest';
  version = distTags[version] || version;
  debug('version', version);
  let looseVersion = Object.keys(modInfo.versions).pop();
  debug('looseVersion', looseVersion);
  return modInfo.versions[version] || modInfo.versions[looseVersion];
};

exports.download = async function (name, prefix) {
  if (!name) return;
  debug('download', name);
  let trimedName = this.parseName(name, prefix).fullName;
  debug('download trimedName', trimedName);
  let stamp = new Stamp(`${trimedName}.module`);
  let storeDir = await store.getPath('modules');
  let filename = path.normalize(
    `${storeDir}/${trimedName.replace(/\//, '-')}.tgz`
  );
  let isExists = fs.existsSync(filename);
  if (!isExists || await stamp.isExpire()) {
    let info = await this.getVersionInfo(trimedName);
    if (!info || !info.dist || !info.dist.tarball) {
      throw new Error(`Cannot download ${trimedName}`);
    }
    debug('download url', info.dist.tarball);
    let res;
    try {
      res = await download(info.dist.tarball);
    } catch (err) {
      if (isExists) return filename;
      throw err;
    }
    if (res.status < 200 || res.status > 299) {
      if (isExists) return filename;
      throw new Error('Download error:', name);
    }
    await Promise.all([
      save(filename, res),
      stamp.write()
    ]);
  }
  debug('download done', filename);
  return filename;
};

exports.clean = async function () {
  await del([path.normalize(`${process.cwd()}/node_modules/**`)], {
    force: true
  });
};