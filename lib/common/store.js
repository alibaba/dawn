/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const pkg = require('../../package');
const path = require('path');
const mkdirp = require('mkdirp');
const del = require('del');

exports.getBaseDir = function () {
  let env = process.env;
  let location = env.HOME ||
    env.APPDATA ||
    env.LOCALAPPDATA ||
    env.TMPDIR ||
    env.TEMP;
  return path.normalize(`${location}/.${pkg.realName}`);
};

exports.getPath = async function (name) {
  name = name || '';
  let baseDir = this.getBaseDir();
  let storePath = path.normalize(`${baseDir}/${name}`);
  await mkdirp(storePath);
  return storePath;
};

exports.clean = async function (name) {
  let dir = this.getBaseDir();
  if (name) dir += `/${name}`;
  await del([`${dir}/**/*.*`], {
    force: true
  });
};