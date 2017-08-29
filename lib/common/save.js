/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

const fs = require('fs');

module.exports = function (filename, readStream) {
  return new Promise(reslove => {
    let writeStream = fs.createWriteStream(filename);
    writeStream.on('finish', () => {
      setTimeout(reslove, 100);
    });
    readStream.pipe(writeStream);
  });
};