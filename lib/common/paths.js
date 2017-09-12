const path = require('path');
const pkg = require('../../package');
const ENV = process.env;

exports.homePath = function () {
  return ENV.HOME || ENV.USERPROFILE || (ENV.HOMEDRIVE + ENV.HOMEPATH);
};

exports.dataPath = function () {
  return ENV.HOME || ENV.APPDATA || ENV.LOCALAPPDATA ||
    ENV.TMPDIR || ENV.TEMP;
};

exports.storePath = function () {
  return path.normalize(`${this.dataPath()}/.${pkg.realName}`);
};

exports.rcPath = function () {
  return `${this.homePath()}/.${pkg.realName}rc`;
};