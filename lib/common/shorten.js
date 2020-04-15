/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

module.exports = function (str, max) {
  if (!str || str.length < max) return str;
  return str.slice(0, max - 3) + '...';
};