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
const console = require('./common/console');
const pkgname = require('./common/pkgname');

const FETCT_TIMEOUT = 30000;
const OFFICIAL_NPM_PKG_URL_PREFIX = 'https://www.npmjs.com/package';

exports.exec = async function (cmd, opts) {
  opts = Object.assign({}, opts);
  opts.cwd = opts.cwd || process.cwd();
  opts.flag = opts.flag || {};
  opts.flag.registry = decodeURIComponent(
    opts.flag.registry || await configs.getRc('registry')
  );
  const flags = [];
  utils.each(opts.flag, (name, value) => {
    const flagName = (name.length > 1 ? '--' : '-') + name;
    const flagValue = utils.isString(value) ? `=${value}` : '';
    flags.push(`${flagName}${flagValue}`);
  });
  const npmBin = await configs.getRc('npm') || 'npm';
  const script = `${npmBin} ${cmd || ''} ${flags.join(' ')}`;
  debug('exec script', script);
  await exec(script, { cwd: opts.cwd, ...opts.execOpts });
};

exports.install = async function (name, opts) {
  opts = Object.assign({}, opts);
  opts.flag = opts.flag || {};
  const pkgFile = path.normalize(`${process.cwd()}/package.json`);
  if (!opts.flag.global && !opts.flag.g && !fs.existsSync(pkgFile)) {
    return;
  }
  console.info(`Installing '${name || 'dependencies'}' ...`);
  const nameInfo = pkgname(name, opts.prefix);
  delete opts.prefix;
  await this.exec(`i ${nameInfo.fullNameAndVersion || ''}`, opts);
  console.info('Done');
};

exports.getInfo = async function (name) {
  const registryUri = trim(await configs.getRc('registry'), '/');
  debug('serverUri', registryUri);
  const url = `${registryUri}/${name}`;
  debug('getInfo', url);
  const res = await fetch(url, { timeout: FETCT_TIMEOUT });
  const info = await res.json();
  debug('getInfo', 'ok');
  if (!info || !info.versions || info.error) {
    debug('Module Info', info);
    throw new Error(`Cannot find module '${name}'`);
  }
  return info;
};

exports.getVersionInfo = async function (name, version) {
  debug('getVersionInfo', name, version);
  const modInfo = await this.getInfo(name) || {};
  const distTags = modInfo['dist-tags'] || {};
  version = version || 'latest';
  version = distTags[version] || version;
  debug('version', version);
  const looseVersion = Object.keys(modInfo.versions).pop();
  debug('looseVersion', looseVersion);
  return modInfo.versions[version] || modInfo.versions[looseVersion];
};

exports.download = async function (name, prefix) {
  if (!name) return;
  console.info(`Downloading '${name}' ...`);
  const nameInfo = pkgname(name, prefix);
  debug('download', name, nameInfo.fullName);
  const stamp = new Stamp(`${nameInfo.fullName}.module`);
  const storeDir = await store.getPath('modules');
  const filename = path.normalize(
    `${storeDir}/${nameInfo.fullName.replace(/\//, '-')}.tgz`
  );
  const isExists = fs.existsSync(filename);
  if (!isExists || await stamp.isExpire()) {
    const verInfo = await this.getVersionInfo(nameInfo.fullName);
    if (!verInfo || !verInfo.dist || !verInfo.dist.tarball) {
      throw new Error(`Cannot download ${nameInfo.fullName}`);
    }
    debug('download url', verInfo.dist.tarball);
    let res;
    try {
      res = await download(verInfo.dist.tarball);
    } catch (err) {
      console.info('Done');
      if (isExists) return filename;
      throw err;
    }
    if (res.status < 200 || res.status > 299) {
      if (isExists) return filename;
      throw new Error('Download error:', name);
    }
    await Promise.all([save(filename, res), stamp.write()]);
  }
  console.info('Done');
  return filename;
};

exports.getDocUrl = async function (name, prefix) {
  const nameInfo = pkgname(name, prefix);
  const registryUri = decodeURIComponent(trim(
    await configs.getRc('registry'), '/'
  ));
  debug('registryUri', registryUri);
  const url = `${OFFICIAL_NPM_PKG_URL_PREFIX}/${nameInfo.fullName}`;
  debug('docUrl', url);
  return url;
};

exports.clean = async function (cleanLock) {
  const items = [path.normalize(`${process.cwd()}/node_modules/`)];
  if (cleanLock) {
    items.push(path.normalize(`${process.cwd()}/package-lock.json`));
  }
  await del(items, { force: true });
};
