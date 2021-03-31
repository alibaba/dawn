/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const fetch = require('./fetch');

module.exports = function (url) {
  return fetch(url)
    .then(function (res) {
      return res.body;
    });
};