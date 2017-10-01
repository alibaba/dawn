/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const stream2buffer = require('stream-to-buffer');

module.exports = function (stream) {
  return new Promise((reslove, reject) => {
    stream2buffer(stream, (err, buffer) => {
      if (err) return reject(err);
      reslove(buffer);
    });
  });
};