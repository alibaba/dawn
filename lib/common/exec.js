/**
 * Copyright (c) 2016-present Alibaba Group Holding Limited
 * @author Houfeng <admin@xhou.net>
 */

const shify = require('shify');
const debug = require('debug')('exec');

module.exports = function (script, opts) {
  opts = opts || {};
  opts.cwd = opts.cwd || process.cwd();
  opts.stdio = opts.stdio || 'inherit';
  opts.builtIn = true;
  debug('opts', opts);
  script = script || '';
  debug('script', opts);
  return new Promise((resolve, reject) => {
    let io = shify(script, opts);
    io.on('exit', code => {
      debug('exit', code);
      if (code > 0) {
        return reject(new Error(`Script Error, exit ${code}`));
      }
      resolve(io);
    });
  });
};