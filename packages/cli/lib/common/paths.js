/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const path = require('path');
const ENV = process.env;

exports.homePath = function () {
  return ENV.HOME || ENV.USERPROFILE || ENV.HOMEDRIVE + ENV.HOMEPATH;
};

exports.dataPath = function () {
  return ENV.HOME || ENV.APPDATA || ENV.LOCALAPPDATA || ENV.TMPDIR || ENV.TEMP;
};

exports.storePath = function () {
  return path.normalize(`${this.dataPath()}/.dawn`);
};

exports.rcPath = function () {
  return `${this.homePath()}/.dawnrc`;
};
