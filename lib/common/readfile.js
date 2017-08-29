/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

const fs = require('fs');

module.exports = async function (filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer);
    });
  });
};