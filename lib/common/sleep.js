/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

module.exports = function (delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};