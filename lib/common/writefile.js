/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
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