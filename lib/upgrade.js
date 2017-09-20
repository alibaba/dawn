/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const mod = require('./mod');
const pkg = require('../package');
const console = require('console3');
const cache = require('./cache');
const store = require('./store');
const debug = require('debug')('upgrade');

async function getLastInfo() {
  let lastInfo, cacheInfo;
  try {
    cacheInfo = await cache.get('upgrade');
    cacheInfo.value = JSON.parse(cacheInfo.value);
  } catch (err) {
    cacheInfo = {};
  }
  debug('getLastInfo', 'cacheInfo', JSON.stringify(cacheInfo));
  if (!cacheInfo.isExists || cacheInfo.isExpire || !cacheInfo.value) {
    lastInfo = await mod.getVersionInfo(pkg.name);
    await cache.set('upgrade', JSON.stringify(lastInfo));
    debug('getLastInfo', 'from network');
  } else {
    lastInfo = cacheInfo.value;
    debug('getLastInfo', 'from cahce');
  }
  return lastInfo;
}

async function checkCurrentVersion() {
  let cacheInfo = await cache.get('version');
  cacheInfo.value = cacheInfo.value ? cacheInfo.value.toString() : '';
  debug('checkCurrentVersion', 'cache', cacheInfo.value);
  debug('checkCurrentVersion', 'pkg', pkg.version);
  if (cacheInfo.value !== pkg.version) {
    await store.clean('caches');
    await cache.set('version', pkg.version);
  }
}

exports.check = async function () {
  console.info('Check the latest version...');
  await checkCurrentVersion();
  let lastInfo = await getLastInfo();
  debug('last version', lastInfo.version);
  debug('current version', pkg.version);
  if (lastInfo.version === pkg.version) {
    console.info('The current version is the latest version');
  } else {
    console.warn('--------------------------------------------------');
    console.warn(`The latest version is ${lastInfo.version}`);
    console.warn(`Please upgrade through the \`npm install ${pkg.name} -g\``);
    console.warn('--------------------------------------------------');
  }
};