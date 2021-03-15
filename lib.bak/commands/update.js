/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const console = require('../common/console');
const store = require('../store');
const mod = require('../mod');

module.exports = async function (cleanLock) {
  console.info('Updating...');
  if (cleanLock) console.log('Clean lockfile..')
  await Promise.all([
    store.clean('stamps'),
    store.clean('caches'),
    store.clean('modules'),
    mod.clean(cleanLock)
  ]);
  await mod.install();
  console.info('Done');
};