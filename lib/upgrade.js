/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const mod = require('./mod');
const pkg = require('../package');
const console = require('console3');
const cache = require('./cache');
const debug = require('debug')('upgrade');

exports.check = async function () {
  console.info('Check the latest version...');
  let lastInfo, cacheInfo;
  try {
    cacheInfo = await cache.get('upgrade');
    cacheInfo.value = JSON.parse(cacheInfo.value);
  } catch (err) {
    cacheInfo = {};
  }
  debug('check', 'cacheInfo', JSON.stringify(cacheInfo));
  if (!cacheInfo.isExists || cacheInfo.isExpire || !cacheInfo.value) {
    lastInfo = await mod.getVersionInfo(pkg.name);
    await cache.set('upgrade', JSON.stringify(lastInfo));
    debug('check', 'from network');
  } else {
    lastInfo = cacheInfo.value;
    debug('check', 'from cahce');
  }
  debug('check', 'last version', lastInfo.version);
  if (lastInfo.version === pkg.version) {
    console.info('The current version is the latest version');
  } else {
    console.warn('--------------------------------------------------');
    console.warn(`The latest version is ${lastInfo.version}`);
    console.warn(`Please upgrade through the \`npm installl ${pkg.name} -g\``);
    console.warn('--------------------------------------------------');
  }
};