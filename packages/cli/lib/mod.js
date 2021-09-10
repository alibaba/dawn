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
const moduleResolve = require('./common/moduleResolve');
const readJson = require('./common/readJson');
const semver = require('semver');
const cp = require('child_process');

const FETCT_TIMEOUT = 30000;
const OFFICIAL_NPM_PKG_URL_PREFIX = 'https://www.npmjs.com/package';

exports.exec = async function (cmd, opts) {
  opts = Object.assign({}, opts);
  opts.cwd = opts.cwd || process.cwd();
  opts.flag = opts.flag || {};
  opts.flag.registry = decodeURIComponent(opts.flag.registry || (await configs.getRc('registry')));
  const flags = [];
  utils.each(opts.flag, (name, value) => {
    const flagName = (name.length > 1 ? '--' : '-') + name;
    const flagValue = utils.isString(value) ? `=${value}` : '';
    flags.push(`${flagName}${flagValue}`);
  });
  const npmBin = (await configs.getRc('npm')) || 'npm';
  const script = `${npmBin} ${cmd || ''} ${flags.join(' ')}`;
  debug('exec script', script);
  await exec(script, { cwd: opts.cwd, ...opts.execOpts });
};

exports.install = async function (name, opts) {
  opts = Object.assign({}, opts);
  opts.flag = opts.flag || {};
  const pkgFile = path.normalize(`${process.cwd()}/package.json`);
  if (!opts.flag.global && !opts.flag.g && !fs.existsSync(pkgFile)) {
    throw new Error('Only support install globally while no local package.json exists.');
  }
  console.info(`Installing '${name || 'dependencies'}' ...`);
  const nameInfo = pkgname(name, opts.prefix);
  delete opts.prefix;
  await this.exec(`i ${nameInfo.fullNameAndVersion || ''}`, opts);
  console.info('Done');
};

function semverReverseSort(a, b) {
  const lt = semver.lt(a, b);
  const gt = semver.gt(a, b);
  if (!lt && !gt) {
    return 0;
  } else if (lt) {
    return 1;
  }
  return -1;
}

function findResolution(name, requiredVer) {
  try {
    const stdout = cp.execSync(`npm view ${name} versions`);
    const availableVersions = JSON.parse(stdout.toString('utf-8').replace(/'/g, '"')).sort(semverReverseSort);
    const findedVer = availableVersions.find(ver => semver.satisfies(ver, requiredVer));
    return findedVer;
  } catch (e) {
    console.error(e);
    return null;
  }
}

async function getPeerDeps(name) {
  const cwd = process.cwd();
  const pkgPath = moduleResolve(cwd, name);
  if (!pkgPath) {
    console.error(`${nameInfo.fullName} not found.`);
    return [];
  }
  const pkgJsonPath = path.join(pkgPath, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    console.error(`package.json missing at ${pkgJsonPath}`);
    return [];
  }
  const pkgJson = await readJson(pkgJsonPath);
  const projectJson = await readJson(path.join(cwd, 'package.json'));
  return Object.keys(pkgJson.peerDependencies || {}).reduce((acc, depName) => {
    const requiredDepVer = pkgJson.peerDependencies[depName];
    const installedDepVer = (projectJson.dependencies || {})[depName] || (projectJson.devDependencies || {})[depName];
    if (!installedDepVer) {
      const ver = findResolution(depName, requiredDepVer);
      if (!ver) {
        console.error(`no satisfied verson for ${depName} with ${requiredDepVer}`);
        return acc;
      }
      return acc.concat({ name: depName, version: ver });
    }
    if (semver.satisfies(installedDepVer, requiredDepVer)) {
      return acc;
    }
    console.error(
      `${depName} installed ${installedDepVer} in project not satify peerDeps requirement for ${requiredDepVer}`,
    );
    return acc;
  }, []);
}

exports.installPeerDeps = async function (name, opts) {
  opts = Object.assign({}, opts);
  const nameInfo = pkgname(name, opts.prefix);
  delete opts.prefix;
  const peerDeps = await getPeerDeps(nameInfo.fullName);
  for (let i = 0; i < peerDeps.length; i++) {
    const peerDep = peerDeps[i];
    await this.install(`${peerDep.name}@${peerDep.version}`, opts);
  }
};

exports.installWithPeer = async function (name, opts) {
  await this.install(name, opts);
  await this.installPeerDeps(name, opts);
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
  const modInfo = (await this.getInfo(name)) || {};
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
  const filename = path.normalize(`${storeDir}/${nameInfo.fullName.replace(/\//, '-')}.tgz`);
  const isExists = fs.existsSync(filename);
  if (!isExists || (await stamp.isExpire())) {
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
  const registryUri = decodeURIComponent(trim(await configs.getRc('registry'), '/'));
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
