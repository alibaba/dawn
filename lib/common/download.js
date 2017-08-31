/**
 * Copyright (c) 2017 Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const fetch = require('./fetch');

module.exports = function (url) {
  return fetch(url)
    .then(function (res) {
      return res.body;
    });
};