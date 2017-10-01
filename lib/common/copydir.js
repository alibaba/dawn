/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const copydir = require('copy-dir');

module.exports = function (src, dst) {
  return new Promise((resolve, reject) => {
    copydir(src, dst, function (err) {
      if (err) return reject(err);
      return resolve(dst);
    });
  });
};