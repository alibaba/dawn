/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const mkdirp = require('mkdirp');

module.exports = async function (path) {
  return new Promise((reslove, reject) => {
    mkdirp(path, err => {
      if (err) return reject(err);
      reslove(path);
    });
  });
};