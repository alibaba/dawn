/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const path = require('path');
const del = require('del');
const mkdirp = require('./common/mkdirp');
const paths = require('./common/paths');

exports.getPath = async function (name) {
  name = name || '';
  let storePath = paths.storePath();
  let storeItemPath = path.normalize(`${storePath}/${name}`);
  await mkdirp(storeItemPath);
  return storeItemPath;
};

exports.clean = async function (name) {
  let storePath = paths.storePath();
  if (name) storePath += `/${name}`;
  await del([`${storePath}/**/*.*`], {
    force: true
  });
};