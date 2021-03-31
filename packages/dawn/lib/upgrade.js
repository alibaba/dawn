/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const pkg = require('../package');
const updateNotifier = require('update-notifier');
const debug = require('debug')('upgrade');

const updateCheckInterval = pkg.configs.cache;
const boxenOpts = {
  padding: 1,
  margin: 0,
  align: 'center',
  borderColor: 'yellow',
  borderStyle: 'single'
};
const isGlobal = true;

exports.check = function () {
  debug('interval', updateCheckInterval);
  updateNotifier({
    pkg, updateCheckInterval
  }).notify({ isGlobal, boxenOpts });
};