/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const path = require('path');
const del = require('del');
const mkdirp = require('./common/mkdirp');
const paths = require('./common/paths');

exports.getPath = async function (name) {
  const storePath = paths.storePath();
  const storeItemPath = path.normalize(`${storePath}/${name || ''}`);
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