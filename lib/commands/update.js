/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

const console = require('console3');
const store = require('../common/store');
const mod = require('../mod');

module.exports = async function () {
  console.info('Updating...');
  await Promise.all([store.clean(), mod.clean()]);
  await mod.install();
  console.info('Done');
};