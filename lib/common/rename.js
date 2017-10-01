/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const fs = require('fs');

module.exports = async function (src, dst) {
  return new Promise((resolve, reject) => {
    fs.rename(src, dst, (err) => {
      if (err) return reject(err);
      resolve(dst);
    });
  });
};