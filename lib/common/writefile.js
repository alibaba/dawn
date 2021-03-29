/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const fs = require('fs');
const Buffer = require('buffer').Buffer;

module.exports = async function(filename, content) {
  return new Promise((resolve, reject) => {
    if (typeof content !== 'string' && !Buffer.isBuffer(content)) {
      content = String(content);
    }
    fs.writeFile(filename, content, (err) => {
      if (err) return reject(err);
      resolve(filename);
    });
  });
};
