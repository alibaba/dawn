/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const configs = require('./configs');
const utils = require('ntils');
const path = require('path');
const mod = require('./mod');
const debug = require('debug')('middleware');
const pkgname = require('./common/pkgname');
const moduleResolve = require('./common/moduleResolve');
const fs = require('fs');
const readJson = require('./common/readJson');
const cp = require('child_process');
const semver = require('semver');

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
    return (item.name && item.name.includes(keyword)) || (item.summary && item.summary.includes(keyword));
  });
  foundList.nameMaxLen = srcList.nameMaxLen;
  return foundList;
};

exports.getInfo = async function (name) {
  if (!utils.isString(name)) return name;
  debug('get', name);
  const prefix = await configs.getRc('middlewarePrefix');
  const nameInfo = pkgname(name, prefix);
  return nameInfo;
};

exports.getDocUrl = async function (name) {
  const prefix = await configs.getRc('middlewarePrefix');
  return mod.getDocUrl(name, prefix);
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

exports.checkPeerDeps = async function (pkgPath, cwd) {
  const pkgJsonPath = path.join(pkgPath, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    console.warn(`package.json missing at ${pkgJsonPath}`);
    return;
  }
  const pkgJson = await readJson(pkgJsonPath);
  const errors = [];
  const needInstallDeps = Object.keys(pkgJson.peerDependencies || {}).reduce((acc, depName) => {
    const requiredDepVer = pkgJson.peerDependencies[depName];
    const installedPkgPath = moduleResolve(cwd, depName);
    const installedDepVer = installedPkgPath ? readJson(path.join(installedPkgPath, 'package.json')).version : null;
    if (!installedDepVer) {
      const ver = findResolution(depName, requiredDepVer);
      if (!ver) {
        errors.push(`no satisfied verson for ${depName} with ${requiredDepVer}`);
        return acc;
      }
      return acc.concat(`${depName}@${ver}`);
    }
    if (semver.satisfies(installedDepVer, requiredDepVer)) {
      return acc;
    } else {
      errors.push(
        `${depName} installed ${installedDepVer} in project not satify peerDeps requirement for ${requiredDepVer}`,
      );
      return acc;
    }
  }, []);
  await mod.batchInstall(needInstallDeps, { flag: { 'save-dev': true } });
  errors.forEach(error => {
    console.error(error);
  });
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

    let packagePath = moduleResolve(cwd, nameInfo.fullName);
    if (!packagePath) {
      const prefix = await configs.getRc('middlewarePrefix');
      await mod.install(nameInfo.fullNameAndVersion, {
        flag: { 'save-dev': true },
        prefix: prefix,
      });
      packagePath = moduleResolve(cwd, nameInfo.fullName);
    }

    await this.checkPeerDeps(packagePath, cwd);

    debug('packagePath', packagePath);
    mdModule = require(packagePath);
  }
  return mdModule && nameInfo.member ? mdModule[nameInfo.member] : mdModule.default || mdModule;
};
