/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const fs = require('fs');

module.exports = function (filename, readStream) {
  return new Promise(reslove => {
    const writeStream = fs.createWriteStream(filename);
    writeStream.on('finish', () => {
      setTimeout(reslove, 100);
    });
    readStream.pipe(writeStream);
  });
};