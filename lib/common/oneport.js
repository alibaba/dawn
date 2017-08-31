/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const oneport = require('oneport');

module.exports = function () {
  return new Promise((resolve, reject) => {
    oneport.acquire((err, port) => {
      if (err) return reject(err);
      resolve(port);
    });
  });
};