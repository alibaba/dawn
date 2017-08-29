/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

const fs = require('fs');

module.exports = async function (filename, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, content, err => {
      if (err) return reject(err);
      resolve(filename);
    });
  });
};