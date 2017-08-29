/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
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