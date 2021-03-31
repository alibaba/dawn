/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const nodeFetch = require('node-fetch');

const DEFAULT_TIMEOUT = -1;

function fetch(url, opts) {
  url = decodeURIComponent(url.trim());
  opts = Object.assign({}, opts);
  opts.timeout = opts.timeout || DEFAULT_TIMEOUT;
  return new Promise((resolve, reject) => {
    const timer = opts.timeout > -1 ?
      setTimeout(() => {
        reject(new Error(`Request '${url}' timeout`));
      }, opts.timeout) : null;
    const wrapper = fn => {
      return (...args) => {
        if (timer) clearTimeout(timer);
        return fn(...args);
      };
    };
    delete opts.timeout;
    const innerFetch = (fetch.filter ?
      fetch.filter(url, opts) : nodeFetch) || nodeFetch;
    innerFetch(url, opts)
      .then(wrapper(resolve))
      .catch(wrapper(reject));
  });
}

module.exports = fetch;