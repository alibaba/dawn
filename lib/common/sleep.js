/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 */

module.exports = function (delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};