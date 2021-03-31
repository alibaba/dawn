/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

module.exports = function (delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
};