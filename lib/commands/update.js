/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const console = require('console3');
const store = require('../store');
const mod = require('../mod');

module.exports = async function () {
  console.info('Updating...');
  await Promise.all([
    store.clean('stamps'),
    store.clean('caches'),
    store.clean('modules'),
    mod.clean()
  ]);
  await mod.install();
  console.info('Done');
};