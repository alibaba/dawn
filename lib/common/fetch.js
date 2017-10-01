/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const nodeFetch = require('node-fetch');

const DEFAULT_TIMEOUT = -1;

function fetch(url, opts) {
  opts = Object.assign({}, opts);
  opts.timeout = opts.timeout || DEFAULT_TIMEOUT;
  return new Promise((resolve, reject) => {
    let timer = opts.timeout > -1 ?
      setTimeout(() => {
        reject(new Error(`Request '${url}' timeout`));
      }, opts.timeout) : null;
    let wrapper = fn => {
      return (...args) => {
        if (timer) clearTimeout(timer);
        return fn(...args);
      };
    };
    delete opts.timeout;
    let innerFetch = (fetch.filter ?
      fetch.filter(url, opts) : nodeFetch) || nodeFetch;
    innerFetch(url, opts)
      .then(wrapper(resolve))
      .catch(wrapper(reject));
  });
}

module.exports = fetch;