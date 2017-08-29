/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

const stream2buffer = require('stream2buffer');

module.exports = function (stream) {
  return new Promise((reslove, reject) => {
    stream2buffer(stream, (err, buffer) => {
      if (err) return reject(err);
      reslove(buffer);
    });
  });
};